import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/core/audit.schema';
import { UserRole } from '../common/enums/user-roles.enum';
import { Subscription } from './subscription.class';

export type UserDocument = HydratedDocument<User>;
export type UsersModel = Model<User>;
export type FlatUser = FlattenMaps<User & { _id: string }>;

@Schema({ collection: 'users' })
export class User extends Audit {
  @Prop({ isRequired: true })
  firstName: string;

  @Prop({ isRequired: true })
  lastName: string;

  @Prop({ isRequired: true, unique: true })
  email: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop({
    isRequired: true,
    validate: {
      message: (arr: any) => `${arr} is not a valid UserRole enum array`,
      validator: (arr: string[]) => {
        return arr.every(val => Object.values(UserRole).includes(val as UserRole));
      },
    },
  })
  roles: UserRole[];

  @Prop({ isRequired: true })
  isAuthorized: boolean;

  @Prop()
  subscription?: Subscription;

  @Prop()
  stripeCustomerId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
