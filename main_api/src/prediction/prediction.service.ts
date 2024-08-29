import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionResult } from 'src/common/dtos/prediction-result.dto';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency, FrequencyUtil } from 'src/common/enums/frequency.enum';
import { PoliticalLeaning } from 'src/common/enums/political-leaning.enum';
import { PredictionStatus } from 'src/common/enums/prediction-status.enum';
import { Sarcasm } from 'src/common/enums/sarcasm.enum';
import { Sentiment } from 'src/common/enums/sentiment.enum';
import { Text } from 'src/common/enums/text.enum';
import { Audit } from 'src/common/schema/audit.schema';
import { MongooseUtil } from 'src/common/util/mongoose.util';
import { FeedbackService } from 'src/feedback/feedback.service';
import { NewsSearchService } from 'src/news-search/news-search.service';
import { SearchResult } from 'src/news-search/search-result';
import { NewsSourceService } from 'src/news-source/news-source.service';
import { PredictionFeignClient } from './prediction.feign';
import { Prediction, PredictionDocument } from './prediction.schema';
import { PredictionUtil } from './prediction.util';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(
    @Inject(forwardRef(() => FeedbackService))
    private feedbackService: FeedbackService,
    private readonly newsSearchService: NewsSearchService,
    private readonly newsSourceService: NewsSourceService,
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

    this.logger.log(`Deleted prediction with id '${id}'`);
  }

  async createPrediction(text: string, url: string, userId: string): Promise<PredictionDocument> {
    this.logger.log(`Creating new prediction record from user ${userId} for text ${text}`);

    const domain = new URL(url).hostname;
    let newsSource: Awaited<ReturnType<NewsSourceService['getNewsSource']>>;
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
        status: PredictionStatus.COMPLETED,
        result: { $exists: true },
      });

      if (existingPrediction) {
        this.logger.log(
          `Found exactly similar prediction ${existingPrediction.id} for prediction ${savedPrediction.id}`,
        );
        sourcePredictionId = existingPrediction.id;
        transformedResult = existingPrediction.result ?? ({} as PredictionResult);
        searchResults = existingPrediction.searchResults ?? [];
        keywords = existingPrediction.keywords ?? [];
      } else {
        this.logger.log(`No similar prediction found for prediction ${savedPrediction.id}. Starting prediction job`);

        // If this text has not already been predicted for, then we need to proceed with the
        // prediction job
        savedPrediction.status = PredictionStatus.PREDICTING_FAKE_NEWS;
        savedPrediction.updatedAt = new Date();
        savedPrediction.updatedBy = userId;
        await savedPrediction.save();
        const predictionResult = await this.predictionFeignClient.getPredictionForText(text);
        transformedResult = PredictionUtil.buildPredictionResult(predictionResult);
        this.logger.log(`Built prediction result for prediction ${savedPrediction.id}`);

        // Get related web-pages
        savedPrediction.status = PredictionStatus.EXTRACTING_KEYWORDS;
        savedPrediction.updatedAt = new Date();
        savedPrediction.updatedBy = userId;
        savedPrediction.result = transformedResult;
        await savedPrediction.save();
        keywords = await this.predictionFeignClient.extractKeywords(text);
        this.logger.log(`Extracted keywords for prediction ${savedPrediction.id}`);

        // Search for news articles
        savedPrediction.status = PredictionStatus.SEARCHING_RESULTS;
        savedPrediction.updatedAt = new Date();
        savedPrediction.updatedBy = userId;
        savedPrediction.keywords = keywords;
        await savedPrediction.save();
        searchResults = await this.newsSearchService.performSearch(keywords.join(' '));
        this.logger.log(`Search results found for prediction ${savedPrediction.id}`);
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
      this.logger.log(`Prediction job completed for prediction ${savedPrediction.id}`);
    } catch (error) {
      this.logger.error(`Error occurred while creating prediction record for text ${text}`, error);
      savedPrediction.status = PredictionStatus.FAILED;
      savedPrediction.updatedAt = new Date();
      savedPrediction.updatedBy = userId;
      await savedPrediction.save();
    }
    return savedPrediction;
  }

  async getPredictionPage(pageRequest: PageRequest) {
    return await MongooseUtil.getDocumentPage(this.predictionModel, pageRequest);
  }

  private getCountInRange<T extends Audit>(
    items: T[],
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    filter: (item: T) => boolean | undefined,
  ) {
    return items
      .filter(item => dayjs(item.createdAt).isBefore(end))
      .filter(item => dayjs(item.createdAt).isAfter(start))
      .filter(filter).length;
  }

  async getSentimentAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'positive' | 'negative' | 'fake' | 'notFake' | 'tweet' | 'news'>> {
    const fields = ['fake', 'notFake', 'positive', 'negative', 'tweet', 'news'] as const;
    let bins: TimeBasedAnalytics<(typeof fields)[number]>['bins'] = [];
    const items = await this.predictionModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      const getItemCount = (filter: (item: Prediction) => boolean | undefined) => {
        return this.getCountInRange(items, current, next, filter);
      };

      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const fake = getItemCount(item => item.result?.sentimentFakeResult.prediction);
      const notFake = getItemCount(item => !item.result?.sentimentFakeResult.prediction);
      const positive = getItemCount(item => item.result?.sentimentTypeResult.prediction == Sentiment.POSITIVE);
      const negative = getItemCount(item => item.result?.sentimentTypeResult.prediction == Sentiment.NEGATIVE);
      const tweet = getItemCount(item => item.result?.sentimentTextTypeResult.prediction == Text.TWEET);
      const news = getItemCount(item => item.result?.sentimentTextTypeResult.prediction == Text.NEWS);
      bins = [
        ...bins,
        { startDate: current.toDate(), endDate: next.toDate(), fake, notFake, positive, negative, tweet, news },
      ];
      current = next;
    }

    let sum: TimeBasedAnalytics<(typeof fields)[number]>['sum'] = {
      total: 0,
      fake: _.sum(bins.map(i => i.fake)),
      notFake: _.sum(bins.map(i => i.notFake)),
      positive: _.sum(bins.map(i => i.positive)),
      negative: _.sum(bins.map(i => i.negative)),
      tweet: _.sum(bins.map(i => i.tweet)),
      news: _.sum(bins.map(i => i.news)),
    };
    sum.total = _.sum(Object.values(sum));

    return { sum, bins };
  }

  async getBiasAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'center' | 'left' | 'right' | 'fake' | 'notFake'>> {
    const fields = ['fake', 'notFake', 'center', 'left', 'right'] as const;
    let bins: TimeBasedAnalytics<(typeof fields)[number]>['bins'] = [];
    const items = await this.predictionModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;

    while (current.isBefore(end) && bins.length < stop) {
      const getItemCount = (filter: (item: Prediction) => boolean | undefined) => {
        return this.getCountInRange(items, current, next, filter);
      };

      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const fake = getItemCount(item => item.result?.biasFakeResult.prediction);
      const notFake = getItemCount(item => !item.result?.biasFakeResult.prediction);
      const left = getItemCount(item => item.result?.biasResult.prediction === PoliticalLeaning.LEFT);
      const right = getItemCount(item => item.result?.biasResult.prediction === PoliticalLeaning.RIGHT);
      const center = getItemCount(item => item.result?.biasResult.prediction === PoliticalLeaning.CENTER);
      bins = [...bins, { startDate: current.toDate(), endDate: next.toDate(), fake, notFake, left, right, center }];
      current = next;
    }

    let sum: TimeBasedAnalytics<(typeof fields)[number]>['sum'] = {
      total: 0,
      fake: _.sum(bins.map(i => i.fake)),
      notFake: _.sum(bins.map(i => i.notFake)),
      left: _.sum(bins.map(i => i.left)),
      right: _.sum(bins.map(i => i.right)),
      center: _.sum(bins.map(i => i.center)),
    };
    sum.total = _.sum(Object.values(sum));

    return { sum, bins };
  }

  async getTextAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'low' | 'high' | 'fake' | 'notFake'>> {
    const fields = ['fake', 'notFake', 'low', 'high'] as const;
    let bins: TimeBasedAnalytics<(typeof fields)[number]>['bins'] = [];
    const items = await this.predictionModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const fake = this.getCountInRange(items, current, next, item => item.result?.textFakeResult.prediction);
      const notFake = this.getCountInRange(items, current, next, item => !item.result?.textFakeResult.prediction);
      const high = this.getCountInRange(items, current, next, item => item.result?.textQualityResult.prediction);
      const low = this.getCountInRange(items, current, next, item => !item.result?.textQualityResult.prediction);
      bins = [...bins, { startDate: current.toDate(), endDate: next.toDate(), fake, notFake, high, low }];
      current = next;
    }

    let sum: TimeBasedAnalytics<(typeof fields)[number]>['sum'] = {
      total: 0,
      fake: _.sum(bins.map(i => i.fake)),
      notFake: _.sum(bins.map(i => i.notFake)),
      low: _.sum(bins.map(i => i.low)),
      high: _.sum(bins.map(i => i.high)),
    };
    sum.total = _.sum(Object.values(sum));

    return { sum, bins };
  }

  async getSarcAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'sarc' | 'notSarc' | 'gen' | 'hyperbole' | 'rhet' | 'fake' | 'notFake'>> {
    const fields = ['fake', 'notFake', 'sarc', 'notSarc', 'gen', 'hyperbole', 'rhet'] as const;
    let bins: TimeBasedAnalytics<(typeof fields)[number]>['bins'] = [];
    const items = await this.predictionModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const getItemCount = (filter: (item: Prediction) => boolean | undefined) => {
        return this.getCountInRange(items, current, next, filter);
      };

      const fake = getItemCount(item => item.result?.sarcasmFakeResult.prediction);
      const notFake = getItemCount(item => !item.result?.sarcasmFakeResult.prediction);
      const sarc = getItemCount(item => item.result?.sarcasmPresentResult.prediction);
      const notSarc = getItemCount(item => !item.result?.sarcasmPresentResult.prediction);
      const gen = getItemCount(item => item.result?.sarcasmTypeResult.prediction === Sarcasm.GENERIC);
      const hyperbole = getItemCount(item => item.result?.sarcasmTypeResult.prediction === Sarcasm.HYPERBOLE);
      const rhet = getItemCount(item => item.result?.sarcasmTypeResult.prediction === Sarcasm.RHETORICAL_QUESTION);
      bins = [
        ...bins,
        { startDate: current.toDate(), endDate: next.toDate(), fake, notFake, sarc, notSarc, gen, hyperbole, rhet },
      ];
      current = next;
    }

    let sum: TimeBasedAnalytics<(typeof fields)[number]>['sum'] = {
      total: 0,
      fake: _.sum(bins.map(i => i.fake)),
      notFake: _.sum(bins.map(i => i.notFake)),
      sarc: _.sum(bins.map(i => i.sarc)),
      notSarc: _.sum(bins.map(i => i.notSarc)),
      gen: _.sum(bins.map(i => i.gen)),
      hyperbole: _.sum(bins.map(i => i.hyperbole)),
      rhet: _.sum(bins.map(i => i.rhet)),
    };
    sum.total = _.sum(Object.values(sum));

    return { sum, bins };
  }

  async getFinalAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'fake' | 'notFake'>> {
    const fields = ['fake', 'notFake'] as const;
    let bins: TimeBasedAnalytics<(typeof fields)[number]>['bins'] = [];
    const items = await this.predictionModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const fake = this.getCountInRange(items, current, next, item => item.result?.finalFakeResult);
      const notFake = this.getCountInRange(items, current, next, item => !item.result?.finalFakeResult);
      bins = [...bins, { startDate: current.toDate(), endDate: next.toDate(), fake, notFake }];
      current = next;
    }

    let sum: TimeBasedAnalytics<(typeof fields)[number]>['sum'] = {
      total: 0,
      fake: _.sum(bins.map(i => i.fake)),
      notFake: _.sum(bins.map(i => i.notFake)),
    };
    sum.total = _.sum(Object.values(sum));

    return { sum, bins };
  }
}
