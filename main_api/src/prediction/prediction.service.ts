import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { PageRequest } from "src/common/dtos/page-request.dto";
import { PredictionFeignClient } from "./prediction.feign";
import { FlatUser } from "src/users/user.schema";
import { MongooseUtil } from "src/common/util/mongoose.util";
import { InjectModel } from "@nestjs/mongoose";
import { Prediction, PredictionDocument } from "./prediction.schema";
import { Model } from "mongoose";
import ErrorMessage from "src/common/enums/error-message.enum";
import { PredictionUtil } from "./prediction.util";
import { FeedbackService } from "src/feedback/feedback.service";

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(
    @Inject(forwardRef(() => FeedbackService))
    private feedbackService: FeedbackService,
    private readonly predictionFeignClient: PredictionFeignClient,
    @InjectModel(Prediction.name)
    private readonly predictionModel: Model<Prediction>
  ) {}

  async getPrediction(id: string) {
    this.logger.log(`Attempting to find prediction with id ${id}`);
    const foundPrediction = await this.predictionModel.findById(id);

    if (foundPrediction == null) {
      this.logger.warn(`Could not find an existing prediction with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PREDICTION_NOT_FOUND, {
        description: `Prediction with id '${id}' was not found`,
      });
    }

    return foundPrediction;
  }

  async getPredictionFeedback(id: string) {
    await this.getPrediction(id);
    this.logger.log(`Validated prediction ${id} exists`);

    const foundFeedback = await this.feedbackService.getFeedbackByPredictionId(
      id
    );
    return foundFeedback;
  }

  async deletePrediction(id: string) {
    this.logger.log(`Attempting to find prediction with id '${id}'`);
    const deletedPrediction = await this.predictionModel.findByIdAndDelete(id);

    if (deletedPrediction === null) {
      this.logger.warn(`Could not find an existing prediction with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PREDICTION_NOT_FOUND, {
        description: `Prediction with id '${id}' was not found`,
      });
    }

    this.logger.log(`Deleted prediction with id '${id}'`);
  }

  async createPrediction(
    text: string,
    userId: string
  ): Promise<PredictionDocument> {
    this.logger.log(
      `Creating new prediction record from user ${userId} for text ${text}`
    );
    const newPrediction: Prediction = {
      createdAt: new Date(),
      createdBy: userId,
    };

    // Save record
    const savedPrediction = await new this.predictionModel(
      newPrediction
    ).save();

    // Process Text
    this.logger.log(
      `Starting to process text for prediction ${savedPrediction.id}`
    );
    const predictionResult =
      await this.predictionFeignClient.getPredictionForText(text);
    this.logger.log(
      `Finished processing text for prediction ${savedPrediction.id}`
    );

    const transformedResult =
      PredictionUtil.buildPredictionResult(predictionResult);

    // Update record
    savedPrediction.result = transformedResult;
    savedPrediction.updatedAt = new Date();
    savedPrediction.updatedBy = userId;
    await savedPrediction.save();
    this.logger.log(
      `Updated prediction record ${savedPrediction.id} with results`
    );

    return savedPrediction;
  }

  async getPredictionPage(pageRequest: PageRequest) {
    return await MongooseUtil.getDocumentPage(
      this.predictionModel,
      pageRequest
    );
  }
}
