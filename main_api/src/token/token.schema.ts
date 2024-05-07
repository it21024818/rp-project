import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TokenPurpose } from 'src/common/enums/token-purpose.enum';
import { TokenStatus } from 'src/common/enums/token-status.enum';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ collection: 'tokens' })
export class Token {
  @Prop({ unique: true })
  code: string;

  @Prop()
  email: string;

  @Prop(String)
  purpose: TokenPurpose;

  @Prop(String)
  tokenStatus: TokenStatus;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
