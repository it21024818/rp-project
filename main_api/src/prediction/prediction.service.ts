import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workbook } from 'exceljs';
import _ from 'lodash';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionResult } from 'src/common/dtos/prediction-result.dto';
import { GetPredictionAsFileRequestDto } from 'src/common/dtos/request/get-prediction-as-file.request.dto';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { PoliticalLeaning } from 'src/common/enums/political-leaning.enum';
import { PredictionStatus } from 'src/common/enums/prediction-status.enum';
import { Sarcasm } from 'src/common/enums/sarcasm.enum';
import { Sentiment } from 'src/common/enums/sentiment.enum';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';
import { Text } from 'src/common/enums/text.enum';
import { CoreService } from 'src/core/core.service';
import { Feedback, FeedbackDocument, FlatFeedback } from 'src/feedback/feedback.schema';
import { FeedbackService } from 'src/feedback/feedback.service';
import { NewsSearchService } from 'src/news-search/news-search.service';
import { SearchResult } from 'src/news-search/search-result';
import { NewsSource, NewsSourceDocument } from 'src/news-source/news-source.schema';
import { NewsSourceService } from 'src/news-source/news-source.service';
import { UsersService } from 'src/users/users.service';
import { buffer } from 'stream/consumers';
import { PredictionFeignClient } from './prediction.feign';
import { FlatPrediction, Prediction, PredictionDocument } from './prediction.schema';
import { PredictionUtil } from './prediction.util';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(
    private coreService: CoreService,
    @Inject(forwardRef(() => FeedbackService))
    private feedbackService: FeedbackService,
    private readonly newsSearchService: NewsSearchService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => NewsSourceService))
    private newsSourceService: NewsSourceService,
    private readonly predictionFeignClient: PredictionFeignClient,
    @InjectModel(Prediction.name)
    private readonly predictionModel: Model<Prediction>,
  ) {}

  async getPrediction(id: string) {
    this.logger.log(`Attempting to find prediction with id ${id}`);
    const foundPrediction = await this.predictionModel.findById(id);

    if (foundPrediction == null) {
      this.logger.warn(`Could not find an existing prediction with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PREDICTION_NOT_FOUND, {
        description: `Prediction with id '${id}' was not found`,
      });
    }

    return foundPrediction;
  }

  async getPredictionDetails(
    id: string,
  ): Promise<[Prediction, Feedback[], NewsSource | undefined, Prediction | undefined]> {
    const prediction = await this.getPrediction(id);
    const [feedback, newsSource, sourcePrediction] = await Promise.all([
      this.feedbackService.getFeedbackByPredictionId(id),
      prediction.newsSourceId ? this.newsSourceService.getNewsSource(prediction.newsSourceId) : undefined,
      prediction.sourcePredictionId ? this.getPrediction(prediction.sourcePredictionId) : undefined,
    ]);
    return [prediction, feedback, newsSource, sourcePrediction];
  }

  async getByCreatedBy(createdBy: string) {
    this.logger.log(`Attempting to find predictions that were created by ${createdBy}`);
    const foundPredictions = await this.predictionModel.find({ createdBy });
    this.logger.log(`Found ${foundPredictions.length} predictions that were created by ${createdBy}`);
    return foundPredictions;
  }

  async getPredictionFeedback(id: string) {
    await this.getPrediction(id);
    this.logger.log(`Validated prediction ${id} exists`);

    const foundFeedback = await this.feedbackService.getFeedbackByPredictionId(id);
    return foundFeedback;
  }

  async deletePrediction(id: string) {
    this.logger.log(`Attempting to find prediction with id '${id}'`);
    const deletedPrediction = await this.predictionModel.findByIdAndDelete(id);

    if (deletedPrediction === null) {
      this.logger.warn(`Could not find an existing prediction with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PREDICTION_NOT_FOUND, {
        description: `Prediction with id '${id}' was not found`,
      });
    }

    await this.feedbackService.deleteFeedbackByPredictionId(id);
    this.logger.log(`Deleted prediction with id '${id}'`);
  }

  async createPrediction(text: string, url: string, userId: string): Promise<PredictionDocument> {
    this.logger.log(`Creating new prediction record from user '${userId}' for text '${_.truncate(text)}'`);

    const MAX_FREE_PREDICTIONS_PER_DAY = 10;
    const existingUser = await this.usersService.getUser(userId);
    const isAnySubscriptionNotActive = !Object.values(existingUser.subscription ?? {})
      .map(subscription => subscription.status)
      .includes(SubscriptionStatus.ACTIVE);
    if (isAnySubscriptionNotActive && existingUser.predictionsCount >= MAX_FREE_PREDICTIONS_PER_DAY) {
      throw new BadRequestException(ErrorMessage.PREDICTION_QUOTA_EXCEEDED, {
        description: `Daily prediction quota of ${MAX_FREE_PREDICTIONS_PER_DAY} prediction(s) for free user ${userId} has been exceeded`,
      });
    }

    const MIN_TEXT_LENGTH = 10;
    if (text.split(' ').length < MIN_TEXT_LENGTH) {
      throw new BadRequestException(ErrorMessage.PREDICTION_TEXT_TOO_SHORT, {
        description: `Text '${text}' requiring fake news prediction is too short. It needs to be longer than ${MIN_TEXT_LENGTH} words long`,
      });
    }

    const domain = new URL(url).hostname;
    let newsSource: NewsSourceDocument;
    try {
      newsSource = await this.newsSourceService.getNewsSourceByIdentification(domain);
    } catch (error) {
      newsSource = await this.newsSourceService.createNewsSourceByDomain(domain, userId);
    }

    const newPrediction: Prediction = {
      status: PredictionStatus.STARTED,
      text,
      createdAt: new Date(),
      createdBy: userId,
      newsSourceId: newsSource.id,
    };

    // Save record
    const savedPrediction = await this.predictionModel.create(newPrediction);

    try {
      let sourcePredictionId: string | undefined;
      let transformedResult: PredictionResult | undefined;
      let searchResults: SearchResult[] = [];
      let keywords: string[] = [];

      // Check for existing record. We do not need to re-predict in this case
      const existingPrediction = await this.predictionModel.findOne({
        text,
        status: PredictionStatus.COMPLETED, // We should only get completed predictions. Not in-progress or failed
        result: { $exists: true },
      });

      if (existingPrediction) {
        this.logger.log(
          `Found exactly similar prediction '${existingPrediction.id}' for prediction '${savedPrediction.id}'`,
        );
        sourcePredictionId = existingPrediction.id;
        transformedResult = existingPrediction.result ?? ({} as PredictionResult);
        searchResults = existingPrediction.searchResults ?? [];
        keywords = existingPrediction.keywords ?? [];
      } else {
        this.logger.log(`No similar prediction found for prediction '${savedPrediction.id}'. Starting prediction job`);

        // If this text has not already been predicted for, then we need to proceed with the
        // prediction job
        savedPrediction.status = PredictionStatus.PREDICTING_FAKE_NEWS;
        savedPrediction.updatedAt = new Date();
        savedPrediction.updatedBy = userId;
        await savedPrediction.save();
        const predictionResult = await this.predictionFeignClient.getPredictionForText(text);
        transformedResult = PredictionUtil.buildPredictionResult(predictionResult);
        this.logger.log(`Built prediction result for prediction '${savedPrediction.id}'`);

        // Get related web-pages
        savedPrediction.status = PredictionStatus.EXTRACTING_KEYWORDS;
        savedPrediction.updatedAt = new Date();
        savedPrediction.updatedBy = userId;
        savedPrediction.result = transformedResult;
        await savedPrediction.save();
        keywords = (await this.predictionFeignClient.extractKeywords(text)).keywords;
        this.logger.log(`Extracted keywords for prediction '${savedPrediction.id}'`);

        // Search for news articles
        savedPrediction.status = PredictionStatus.SEARCHING_RESULTS;
        savedPrediction.updatedAt = new Date();
        savedPrediction.updatedBy = userId;
        savedPrediction.keywords = keywords;
        await savedPrediction.save();
        searchResults = await this.newsSearchService.performSearch(keywords.join(' '));
        this.logger.log(`Search results found for prediction '${savedPrediction.id}'`);
      }

      // Update record
      savedPrediction.status = PredictionStatus.COMPLETED;
      savedPrediction.sourcePredictionId = sourcePredictionId;
      savedPrediction.keywords = keywords;
      savedPrediction.searchResults = searchResults;
      savedPrediction.result = transformedResult;
      savedPrediction.updatedAt = new Date();
      savedPrediction.updatedBy = userId;
      await savedPrediction.save();
      this.logger.log(`Prediction job completed for prediction '${savedPrediction.id}'`);

      // Update predictions made only for succesful predictions
      existingUser.predictionsCount += 1;
      await existingUser.save();
    } catch (error) {
      this.logger.error(`Error occurred while creating prediction '${savedPrediction.id}'`, error.stack);
      savedPrediction.status = PredictionStatus.FAILED;
      savedPrediction.error = error.stack; // We should save this for debugging purposes
      savedPrediction.updatedAt = new Date();
      savedPrediction.updatedBy = userId;
      await savedPrediction.save();
    }
    return savedPrediction;
  }

  async getPredictionPage(pageRequest: PageRequest) {
    return await this.coreService.getDocumentPage(this.predictionModel, pageRequest);
  }

  private async getFeedbackByPredictionMappings(
    options: GetPredictionAsFileRequestDto,
  ): Promise<Map<PredictionDocument, FeedbackDocument[]>> {
    this.logger.log(`Fetching predictions with feedback mappings with options ${JSON.stringify(options)}`);
    const predictions = await this.predictionModel.find({
      createdAt: { $gte: options.startDate, $lte: options.endDate },
    });
    let feedbacks: FeedbackDocument[] = [];
    if (options.includeFeedback) {
      feedbacks = await this.feedbackService.getFeedbackByPredictionIds(predictions.map(p => p.id));
    }
    const mappings: Map<PredictionDocument, FeedbackDocument[]> = new Map();
    predictions.forEach(pred => {
      const relatedFeedback = feedbacks.filter(feedback => feedback.predictionId === pred.id);
      mappings.set(pred, relatedFeedback);
    });
    this.logger.log('Finished fetching predictions with feedback mappings');
    return mappings;
  }

  async getPredictionsAsWorkbook(userId: string, options: GetPredictionAsFileRequestDto): Promise<Workbook> {
    this.logger.log(`Starting to build workbook for user '${userId}' with options ${JSON.stringify(options)}`);
    const workbook = new Workbook();
    workbook.creator = userId;
    workbook.lastModifiedBy = userId;
    workbook.created = new Date();
    workbook.modified = new Date();
    const sheet = workbook.addWorksheet('Predictions');
    const mappings = await this.getFeedbackByPredictionMappings(options);

    this.logger.log('Setting header rows');
    sheet.getRow(1).values = ['Prediction Id*', 'Text*', 'Feedback Reaction', 'Feedback Message', 'Result'];
    sheet.getRow(2).values = [null, null, null, null, 'Fake', 'Sarcasm', 'Sentiment', 'Bias', 'Text Quality'];

    this.logger.log('Merging relevant header cells');
    sheet.mergeCells(1, 1, 2, 1); // For prediction id
    sheet.mergeCells(1, 2, 2, 2); // For prediction text
    sheet.mergeCells(1, 3, 2, 3); // For feedback response
    sheet.mergeCells(1, 4, 2, 4); // For feedback message
    sheet.mergeCells(1, 5, 1, 9); // For results

    this.logger.log('Styling header rows');
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(2).font = { bold: true };
    sheet.getRow(2).border = { bottom: { style: 'thin' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };

    this.logger.log('Styling columns');
    sheet.getColumn(1).width = 26.0;
    sheet.getColumn(1).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getColumn(2).width = 35.0;
    sheet.getColumn(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getColumn(3).width = 20.0;
    sheet.getColumn(4).width = 35.0;
    sheet.getColumn(4).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    sheet.getColumn(5).width = 6.0;
    sheet.getColumn(6).width = 24.0;
    sheet.getColumn(7).width = 10.0;
    sheet.getColumn(8).width = 10.0;
    sheet.getColumn(9).width = 12.0;

    this.logger.log('Writing prediction feedback mappings');
    let row = 3;
    mappings.forEach((feedbacks, prediction) => {
      let startRowNum = row;
      let currentRow = sheet.getRow(row);

      // Write prediction details
      this.logger.debug(`Writing prediction details for prediction '${prediction.id}' to row ${row}`);
      currentRow.values = [
        prediction.id,
        prediction.text,
        null,
        null,
        prediction.result?.finalFakeResult,
        prediction.result?.sarcasmPresentResult ? prediction.result.sarcasmTypeResult?.prediction : null,
        prediction.result?.sentimentTypeResult.prediction,
        prediction.result?.biasResult.prediction,
        prediction.result?.textQualityResult.prediction,
      ];

      // Write feedback details
      row += 1;
      feedbacks.forEach((feedback, i) => {
        currentRow = sheet.getRow(row);
        this.logger.debug(`Writing feedback details for feedback '${feedback.id}' to row ${row}`);
        currentRow.values = [
          null,
          null,
          feedback.reaction,
          feedback.details?.message,
          feedback.details?.isFake,
          feedback.details?.sarcasm,
          feedback.details?.sentiment,
          feedback.details?.bias,
          feedback.details?.textQuality,
        ];
        row += 1;
      });

      // Merge common cells
      sheet.mergeCells(startRowNum, 1, currentRow.number, 1); // For prediction id
      sheet.mergeCells(startRowNum, 2, currentRow.number, 2); // For text
    });

    this.logger.log('Freezing the first two rows of the sheet');
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 2 }];

    this.logger.log(`Finished building workbook for user '${userId}' with options ${options}`);
    return workbook;
  }

  async getSentimentAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId?: string,
  ): Promise<TimeBasedAnalytics<'positive' | 'negative' | 'fake' | 'notFake' | 'tweet' | 'news'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.predictionModel,
      filters: { newsSourceId },
      options: {
        startDate,
        endDate,
        frequency,
      },
      fields: {
        fake: { path: 'result.sentimentFakeResult.prediction', value: true },
        notFake: { path: 'result.sentimentFakeResult.prediction', value: false },
        positive: { path: 'result.sentimentTypeResult.prediction', value: Sentiment.POSITIVE },
        negative: { path: 'result.sentimentTypeResult.prediction', value: Sentiment.NEGATIVE },
        tweet: { path: 'result.sentimentTextTypeResult.prediction', value: Text.TWEET },
        news: { path: 'result.sentimentTextTypeResult.prediction', value: Text.NEWS },
      },
    });
  }

  async getBiasAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId?: string,
  ): Promise<TimeBasedAnalytics<'center' | 'left' | 'right' | 'fake' | 'notFake'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.predictionModel,
      filters: { newsSourceId },
      options: {
        startDate,
        endDate,
        frequency,
      },
      fields: {
        fake: { path: 'result.biasFakeResult.prediction', value: true },
        notFake: { path: 'result.biasFakeResult.prediction', value: false },
        left: { path: 'result.biasResult.prediction', value: PoliticalLeaning.LEFT },
        right: { path: 'result.biasResult.prediction', value: PoliticalLeaning.RIGHT },
        center: { path: 'result.biasResult.prediction', value: PoliticalLeaning.CENTER },
      },
    });
  }

  async getTextAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId?: string,
  ): Promise<TimeBasedAnalytics<'low' | 'high' | 'fake' | 'notFake'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.predictionModel,
      filters: { newsSourceId },
      options: {
        startDate,
        endDate,
        frequency,
      },
      fields: {
        fake: { path: 'result.textFakeResult.prediction', value: true },
        notFake: { path: 'result.textFakeResult.prediction', value: false },
        high: { path: 'result.textQualityResult.prediction', value: true },
        low: { path: 'result.textQualityResult.prediction', value: false },
      },
    });
  }

  async getSarcAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId?: string,
  ): Promise<TimeBasedAnalytics<'sarc' | 'notSarc' | 'gen' | 'hyperbole' | 'rhet' | 'fake' | 'notFake'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.predictionModel,
      filters: { newsSourceId },
      options: {
        startDate,
        endDate,
        frequency,
      },
      fields: {
        fake: { path: 'result.sarcasmFakeResult.prediction', value: true },
        notFake: { path: 'result.sarcasmFakeResult.prediction', value: false },
        sarc: { path: 'result.sarcasmPresentResult.prediction', value: true },
        notSarc: { path: 'result.sarcasmPresentResult.prediction', value: false },
        gen: { path: 'result.sarcasmTypeResult.prediction', value: Sarcasm.GENERIC },
        hyperbole: { path: 'result.sarcasmTypeResult.prediction', value: Sarcasm.HYPERBOLE },
        rhet: { path: 'result.sarcasmTypeResult.prediction', value: Sarcasm.RHETORICAL_QUESTION },
      },
    });
  }

  async getFinalAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId?: string,
  ): Promise<TimeBasedAnalytics<'fake' | 'notFake'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.predictionModel,
      filters: { newsSourceId },
      options: {
        startDate,
        endDate,
        frequency,
      },
      fields: {
        fake: { path: 'result.finalFakeResult', value: true },
        notFake: { path: 'result.finalFakeResult', value: false },
      },
    });
  }
}
