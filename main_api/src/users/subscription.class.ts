import { Prop } from '@nestjs/mongoose';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';
import { PaymentStrategyKey } from 'src/payments/paymeny-stategy-key.enum';

export class Subscription {
  @Prop()
  subscriptionId?: string;
  @Prop({ isRequired: true })
  customerId: string;
  @Prop()
  planId?: string;
  @Prop({ type: String, enum: Object.values(SubscriptionStatus) })
  status?: SubscriptionStatus;
  @Prop()
  startedTs?: Date;
  @Prop()
  endingTs?: Date;
}
