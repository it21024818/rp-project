import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Reaction } from '../enums/reaction.enum';
import { FeedbackDetails } from './feedback-details.dto';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsEnum(Reaction)
  reaction: Reaction;
  @IsObject()
  @IsOptional()
  details: FeedbackDetails;
}
