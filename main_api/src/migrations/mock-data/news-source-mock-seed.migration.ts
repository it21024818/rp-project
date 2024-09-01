import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Migration } from 'src/common/decorators/migration.decorator';
import { NewsSource } from 'src/news-source/news-source.schema';

@Injectable()
export class NewsSourceMockDataMigration implements OnModuleInit {
  constructor(@InjectModel(NewsSource.name) private readonly newsSourcesModel: Model<NewsSource>) {}

  @Migration('news-sources-mock-data')
  async onModuleInit() {
    const newsSources: NewsSource[] = [];
    for (let i = 0; i < 10; i++) {
      const domain = faker.internet.domainName();
      const name = faker.internet.domainWord();
      const newsSource: NewsSource = {
        createdAt: new Date(),
        createdBy: '66cb70c59f6a062212cdf616',
        domain,
        name,
        identifications: [domain, name],
      };
      newsSources.push(newsSource);
    }
    this.newsSourcesModel.insertMany(newsSources);
  }
}
