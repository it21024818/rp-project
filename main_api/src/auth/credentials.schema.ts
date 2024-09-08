import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { Audit } from 'src/core/audit.schema';

export type CredentialsDocument = HydratedDocument<Credentials>;
export type CredentialssModel = Model<Credentials>;
export type FlatCredentials = FlattenMaps<Credentials & { _id: string }>;

export class AuthDetails extends Audit {
  @Prop({ required: true })
  type: AuthType;
  @Prop()
  typeId?: string;
  @Prop()
  password?: string;
  @Prop({ required: true })
  isActive: boolean;
}

@Schema({ collection: 'credentials' })
export class Credentials extends Audit {
  @Prop({ required: true, unique: true })
  userId: string;
  @Prop({ required: true })
  strategies: AuthDetails[];
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);
