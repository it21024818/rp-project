import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument } from 'mongoose';
import { Audience } from 'src/common/enums/audience.enum';
import { Audit } from 'src/core/audit.schema';

export type AuditedRequestDocument = HydratedDocument<AuditedRequest>;
export type FlatAuditedRequest = FlattenMaps<AuditedRequest & { _id: string }>;

@Schema({ collection: 'audited-requests' })
export class AuditedRequest extends Audit {
  @Prop({ isRequired: true })
  endpoint: string;
  @Prop({ type: Object })
  origin: object;
  @Prop({ isRequired: true, enum: Object.values(Audience) })
  audience: string;
}

export const AuditedRequestSchema = SchemaFactory.createForClass(AuditedRequest);
