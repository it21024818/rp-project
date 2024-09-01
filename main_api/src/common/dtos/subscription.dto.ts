import { Prop } from '@nestjs/mongoose';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';
import { PaymentStrategyKey } from 'src/payments/paymeny-stategy-key.enum';

export class SubscriptionDto {
  @Prop()
  id: string;
  @Prop()
  planId: string;
  @Prop({ type: String, enum: Object.values(SubscriptionStatus) })
  status: SubscriptionStatus;
  @Prop()
  startedTs: Date;
  @Prop()
  endingTs: Date;
  @Prop({ type: String, enum: Object.values(PaymentStrategyKey) })
  strategy?: PaymentStrategyKey;
}
