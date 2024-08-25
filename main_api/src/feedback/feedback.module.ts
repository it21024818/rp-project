import { forwardRef, Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Feedback, FeedbackSchema } from "./feedback.schema";
import { PredictionModule } from "src/prediction/prediction.module";

@Module({
  imports: [
    forwardRef(() => PredictionModule),
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
