import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSource, NewsSourceSchema } from './news-source.schema';
import { NewsSourceService } from './news-source.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: NewsSource.name, schema: NewsSourceSchema }])],
  providers: [NewsSourceService],
  exports: [NewsSourceService],
})
export class NewsSourceModule {}
