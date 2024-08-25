import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { FlattenMaps, HydratedDocument, Model } from "mongoose";
import { Audit } from "src/common/schema/audit.schema";

export type PlanDocument = HydratedDocument<Plan>;
export type PlanModel = Model<Plan>;
export type FlatPlan = FlattenMaps<Plan & { _id: string }>;

@Schema({ collection: "Plans" })
export class Plan extends Audit {
  @Prop()
  name: string;
  @Prop()
  stripeId: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
