import { Feedback } from 'src/feedback/feedback.schema';
import { Reaction } from '../enums/reaction.enum';
import { FeedbackDetails } from './feedback-details.dto';

export class FeedbackDto {
  predictionId: string;
  reaction: Reaction;
  details: FeedbackDetails;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  archived?: boolean;

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

  static buildFromArray(feedback: Feedback[]): FeedbackDto[] {
    return feedback.map(feedback => this.buildFrom(feedback));
  }
}
