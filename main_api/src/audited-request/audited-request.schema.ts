import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type AuditedRequestDocument = HydratedDocument<AuditedRequest>;
export type FlatAuditedRequest = FlattenMaps<AuditedRequest & { _id: string }>;

@Schema({ collection: 'audited-requests' })
export class AuditedRequest extends Audit {
  @Prop()
  endpoint: string;
  @Prop()
  origin: string;
  @Prop({ type: Object })
  request: any;
  @Prop({ type: Object })
  response: any;
}

export const AuditedRequestSchema = SchemaFactory.createForClass(AuditedRequest);
