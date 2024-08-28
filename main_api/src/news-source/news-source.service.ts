import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { NewsSource } from './news-source.schema';

@Injectable()
export class NewsSourceService {
  private readonly logger = new Logger(NewsSourceService.name);
  constructor(@InjectModel(NewsSource.name) private readonly newsSourceModel: Model<NewsSource>) {}

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
      name: domain, // This should be changede later by an admin
    }).save();
    this.logger.log(`Created news source ${domain} with domain ${domain}`);

    return createdNewsSource;
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
}
