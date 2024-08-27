import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { FeedbackDetails } from 'src/common/dtos/feedback-details.dto';
import { Reaction } from 'src/common/enums/reaction.enum';
import { Audit } from 'src/common/schema/audit.schema';

export type FeedbackDocument = HydratedDocument<Feedback>;
export type FeedbackModel = Model<Feedback>;
export type FlatFeedback = FlattenMaps<Feedback & { _id: string }>;

@Schema({ collection: 'feedbacks' })
export class Feedback extends Audit {
  @Prop()
  predictionId: string;
  @Prop({ type: String, enum: Reaction })
  reaction: Reaction;
  @Prop()
  details: FeedbackDetails;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
