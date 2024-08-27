import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NewsSearchService } from './news-search.service';

@Module({
  providers: [NewsSearchService],
  exports: [NewsSearchService],
  imports: [ConfigModule],
})
export class NewsSearchModule {}
