import { Module } from '@nestjs/common';
import { NewsSearchService } from './news-search.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NewsSearchService],
  exports: [NewsSearchService],
  imports: [ConfigModule],
})
export class NewsSearchModule {}
