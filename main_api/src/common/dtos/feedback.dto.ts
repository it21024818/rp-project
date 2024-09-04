import { Feedback } from 'src/feedback/feedback.schema';
import { Prediction } from 'src/prediction/prediction.schema';
import { Reaction } from '../enums/reaction.enum';
import { FeedbackDetails } from './feedback-details.dto';
import { PredictionDto } from './prediction.dto';

export class FeedbackDto {
  predictionId: string;
  reaction: Reaction;
  details: FeedbackDetails;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  archived?: boolean;
  prediction?: PredictionDto;

  static buildFrom(feedback: Feedback): FeedbackDto {
    return {
      details: feedback.details,
      predictionId: feedback.predictionId,
      reaction: feedback.reaction,
      archived: feedback.archived,
      createdAt: feedback.createdAt,
      createdBy: feedback.createdBy,
      updatedAt: feedback.updatedAt,
      updatedBy: feedback.updatedBy,
    };
  }

  static buildWithPrediction(feedback: Feedback, Prediction: Prediction): FeedbackDto {
    return {
      details: feedback.details,
      predictionId: feedback.predictionId,
      reaction: feedback.reaction,
      archived: feedback.archived,
      createdAt: feedback.createdAt,
      createdBy: feedback.createdBy,
      updatedAt: feedback.updatedAt,
      updatedBy: feedback.updatedBy,
      prediction: PredictionDto.buildFrom(Prediction),
    };
  }
  static buildFromArray(feedback: Feedback[]): FeedbackDto[] {
    return feedback.map(feedback => this.buildFrom(feedback));
  }
}
