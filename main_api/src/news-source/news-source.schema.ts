import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type NewsSourceDocument = HydratedDocument<NewsSource>;
export type NewsSourceModel = Model<NewsSource>;
export type FlatNewsSource = FlattenMaps<NewsSource & { _id: string }>;

@Schema({ collection: 'news-sources' })
export class NewsSource extends Audit {
  @Prop()
  name: string;

  @Prop()
  identifications: string[];

  @Prop()
  domain: string;
}

export const NewsSourceSchema = SchemaFactory.createForClass(NewsSource);
