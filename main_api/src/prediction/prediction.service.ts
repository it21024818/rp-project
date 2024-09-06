import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionResult } from 'src/common/dtos/prediction-result.dto';
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
import { Feedback } from 'src/feedback/feedback.schema';
import { FeedbackService } from 'src/feedback/feedback.service';
import { NewsSearchService } from 'src/news-search/news-search.service';
import { SearchResult } from 'src/news-search/search-result';
import { NewsSource, NewsSourceDocument } from 'src/news-source/news-source.schema';
import { NewsSourceService } from 'src/news-source/news-source.service';
import { UsersService } from 'src/users/users.service';
import { PredictionFeignClient } from './prediction.feign';
import { Prediction, PredictionDocument } from './prediction.schema';
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
    const savedPrediction = await new this.predictionModel(newPrediction).save();

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
