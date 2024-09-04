import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Frequency } from 'src/common/enums/frequency.enum';
import { Audit } from 'src/common/schema/audit.schema';

export type PlanDocument = HydratedDocument<Plan>;
export type PlanModel = Model<Plan>;
export type FlatPlan = FlattenMaps<Plan & { _id: string }>;

@Schema({ collection: 'plans' })
export class Plan extends Audit {
  @Prop()
  name: string;
  @Prop()
  stripeId: string;
  @Prop()
  features: string[];
  @Prop()
  amountPerBill: number;
  @Prop({ type: String, enum: Frequency })
  billingFrequency: Frequency;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
