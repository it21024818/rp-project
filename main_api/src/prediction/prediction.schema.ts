import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { FlattenMaps, HydratedDocument, Model } from "mongoose";
import { Audit } from "src/common/schema/audit.schema";
import { PredictionResult } from "src/common/dtos/prediction-result.dto";

export type PredictionDocument = HydratedDocument<Prediction>;
export type PredictionModel = Model<Prediction>;
export type FlatPrediction = FlattenMaps<Prediction & { _id: string }>;

@Schema({ collection: "predictions" })
export class Prediction extends Audit {
  result?: PredictionResult;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
