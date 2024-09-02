import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type AuditedRequestDocument = HydratedDocument<AuditedRequest>;
export type FlatAuditedRequest = FlattenMaps<AuditedRequest & { _id: string }>;

@Schema({ collection: 'audited-requests' })
export class AuditedRequest extends Audit {
  @Prop()
  endpoint: string;
  @Prop({ type: Object })
  origin: object;
  @Prop()
  audience: string;
}

export const AuditedRequestSchema = SchemaFactory.createForClass(AuditedRequest);
