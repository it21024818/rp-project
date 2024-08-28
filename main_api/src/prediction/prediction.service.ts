import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionResult } from 'src/common/dtos/prediction-result.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { PredictionStatus } from 'src/common/enums/prediction-status.enum';
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
}
