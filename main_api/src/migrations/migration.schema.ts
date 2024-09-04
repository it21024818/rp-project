import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type MigrationDocument = HydratedDocument<Migration>;
export type MigrationModel = Model<Migration>;
export type FlatMigration = FlattenMaps<Migration & { _id: string }>;

@Schema({ collection: 'migrations' })
export class Migration extends Audit {
  @Prop()
  key: string;
  @Prop()
  className: string;
}

export const MigrationSchema = SchemaFactory.createForClass(Migration);
