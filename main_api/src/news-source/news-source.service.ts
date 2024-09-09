import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UpdateNewsSourceRequestDto } from 'src/common/dtos/request/update-news-source.request.dto';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { CoreService } from 'src/core/core.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { NewsSource } from './news-source.schema';

@Injectable()
export class NewsSourceService {
  private readonly logger = new Logger(NewsSourceService.name);
  constructor(
    private readonly coreService: CoreService,
    @Inject(forwardRef(() => PredictionService))
    private predictionService: PredictionService,
    @InjectModel(NewsSource.name) private readonly newsSourceModel: Model<NewsSource>,
  ) {}

  async createNewsSourceByDomain(domain: string, userId: string) {
    this.logger.log(`Creating a new news source with domain ${domain}`);
    const existingNewsSource = await this.newsSourceModel.findOne({ identifications: { $in: [domain] } });

    if (existingNewsSource !== null) {
      this.logger.warn(`Attempted news source creation but news source with domain '${domain}' already exists`);
      throw new BadRequestException(ErrorMessage.NEWS_SOURCE_ALREADY_EXISTS);
    }

    const createdNewsSource = await new this.newsSourceModel({
      createdAt: new Date(),
      createdBy: userId,
      domain,
      identifications: [domain],
      name: domain, // This should be changed later by an admin
    }).save();
    this.logger.log(`Created news source ${domain} with domain ${domain}`);

    return createdNewsSource;
  }

  async updateNewsSource(id: string, newsSourceDto: UpdateNewsSourceRequestDto) {
    this.logger.log(`Updating news source with id ${id}`);
    const newsSource = await this.getNewsSource(id);
    newsSource.name = newsSourceDto.name ? newsSourceDto.name : newsSource.name;
    newsSource.identifications = newsSourceDto.identifications
      ? newsSourceDto.identifications
      : newsSource.identifications;
    newsSource.domain = newsSourceDto.domain ? newsSourceDto.domain : newsSource.domain;
    await newsSource.save();
    this.logger.log(`Succesfully updated news source with id ${id}`);
  }

  async getNewsSource(id: string) {
    this.logger.log(`Attempting to find news source with id '${id}'`);
    const foundNewsSource = await this.newsSourceModel.findById(id);

    if (foundNewsSource == null) {
      this.logger.warn(`Could not find an existing news source with id '${id}'`);
      throw new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND, {
        description: `News source with id '${id}' was not found`,
      });
    }

    return foundNewsSource;
  }

  async getNewsSourceByIdentification(domain: string) {
    this.logger.log(`Attempting to find news source with identification ${domain}`);
    const foundNewsSource = await this.newsSourceModel.findOne({ identifications: { $in: [domain] } });

    if (foundNewsSource == null) {
      this.logger.warn(`Could not find an existing news source with identification '${domain}'`);
      throw new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND, {
        description: `News source with identification '${domain}' was not found`,
      });
    }

    return foundNewsSource;
  }

  async getPredictionPage(pageRequest: PageRequest) {
    return await this.coreService.getDocumentPage(this.newsSourceModel, pageRequest);
  }

  async getSentimentAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId: string,
  ): Promise<TimeBasedAnalytics<'positive' | 'negative' | 'fake' | 'notFake' | 'tweet' | 'news'>> {
    await this.getNewsSource(newsSourceId);
    return await this.predictionService.getSentimentAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  async getBiasAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId: string,
  ): Promise<TimeBasedAnalytics<'center' | 'left' | 'right' | 'fake' | 'notFake'>> {
    await this.getNewsSource(newsSourceId);
    return await this.predictionService.getBiasAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  async getTextAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId: string,
  ): Promise<TimeBasedAnalytics<'low' | 'high' | 'fake' | 'notFake'>> {
    await this.getNewsSource(newsSourceId);
    return await this.predictionService.getTextAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  async getSarcAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId: string,
  ): Promise<TimeBasedAnalytics<'sarc' | 'notSarc' | 'gen' | 'hyperbole' | 'rhet' | 'fake' | 'notFake'>> {
    await this.getNewsSource(newsSourceId);
    return await this.predictionService.getSarcAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  async getFinalAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
    newsSourceId: string,
  ): Promise<TimeBasedAnalytics<'fake' | 'notFake'>> {
    await this.getNewsSource(newsSourceId);
    return await this.predictionService.getFinalAnalytics(startDate, endDate, frequency, newsSourceId);
  }
}
