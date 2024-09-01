import { NewsSource } from 'src/news-source/news-source.schema';

export class NewsSourceDto {
  name: string;
  identifications: string[];
  domain: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  archived?: boolean;

  static buildFrom(newsSource: NewsSource): NewsSourceDto {
    return {
      name: newsSource.name,
      identifications: newsSource.identifications,
      domain: newsSource.domain,
      createdBy: newsSource.createdBy,
      updatedBy: newsSource.updatedBy,
      createdAt: newsSource.createdAt,
      updatedAt: newsSource.updatedAt,
      archived: newsSource.archived,
    };
  }
}
