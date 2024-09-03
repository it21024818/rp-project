import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { PredictionResult } from 'src/common/dtos/prediction-result.dto';
import { PredictionStatus } from 'src/common/enums/prediction-status.enum';
import { Audit } from 'src/core/audit.schema';
import { SearchResult } from 'src/news-search/search-result';

export type PredictionDocument = HydratedDocument<Prediction>;
export type PredictionModel = Model<Prediction>;
export type FlatPrediction = FlattenMaps<Prediction & { _id: string }>;

@Schema({ collection: 'predictions' })
export class Prediction extends Audit {
  @Prop()
  text: string;
  @Prop()
  result?: PredictionResult;
  @Prop()
  searchResults?: SearchResult[];
  @Prop()
  keywords?: string[];
  @Prop({ type: String, enum: PredictionStatus })
  status: PredictionStatus;
  @Prop()
  sourcePredictionId?: string;
  @Prop()
  newsSourceId?: string;
  @Prop()
  error?: string;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
