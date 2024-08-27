import { Reaction } from '../enums/reaction.enum';
import { FeedbackDetails } from './feedback-details.dto';

export class CreateFeedbackDto {
  reaction: Reaction;
  details: FeedbackDetails;
}
