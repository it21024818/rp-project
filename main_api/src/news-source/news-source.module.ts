import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionModule } from 'src/prediction/prediction.module';
import { NewsSourceController } from './news-source.controller';
import { NewsSource, NewsSourceSchema } from './news-source.schema';
import { NewsSourceService } from './news-source.service';

@Module({
  imports: [
    forwardRef(() => PredictionModule),
    MongooseModule.forFeature([{ name: NewsSource.name, schema: NewsSourceSchema }]),
  ],
  providers: [NewsSourceService],
  exports: [NewsSourceService],
  controllers: [NewsSourceController],
})
export class NewsSourceModule {}
