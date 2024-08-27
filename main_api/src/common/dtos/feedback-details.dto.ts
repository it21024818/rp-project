import { PoliticalLeaning } from '../enums/political-leaning.enum';
import { Sarcasm } from '../enums/sarcasm.enum';
import { Sentiment } from '../enums/sentiment.enum';
import { UserDto } from './user.dto';

export class FeedbackDetails {
  message?: string;
  textQualityScore?: number;
  sentiment?: Sentiment;
  sarcasm?: Sarcasm;
  bias?: PoliticalLeaning;
  isFake?: boolean;
}
