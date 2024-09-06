import { Feedback } from 'src/feedback/feedback.schema';
import { PaymentStrategyKey } from 'src/payments/paymeny-stategy-key.enum';
import { Prediction } from 'src/prediction/prediction.schema';
import { User } from 'src/users/user.schema';
import { UserRole } from '../enums/user-roles.enum';
import { FeedbackDto } from './feedback.dto';
import { PredictionDto } from './prediction.dto';
import { SubscriptionDto } from './subscription.dto';

export class DetailedUserDto {
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  subscription?: Partial<Record<PaymentStrategyKey, SubscriptionDto>>;
  stripeCustomerId?: string;
  predictions: PredictionDto[];
  feedback: FeedbackDto[];
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  archived?: boolean;

  static buildFrom(user: User, predictions: Prediction[], feedback: Feedback[]): DetailedUserDto {
    return {
      feedback: FeedbackDto.buildFromArray(feedback),
      predictions: PredictionDto.buildFromArray(predictions),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      subscription: user.subscription as Partial<Record<PaymentStrategyKey, SubscriptionDto>>,
      archived: user.archived,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
