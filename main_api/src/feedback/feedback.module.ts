import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PredictionModule } from 'src/prediction/prediction.module';
import { FeedbackController } from './feedback.controller';
import { Feedback, FeedbackSchema } from './feedback.schema';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    forwardRef(() => PredictionModule),
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
