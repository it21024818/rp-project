import { Prop } from '@nestjs/mongoose';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';

export class Subscription {
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
}
