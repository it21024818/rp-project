import { Prop } from '@nestjs/mongoose';

export class Audit {
  @Prop()
  createdBy: string;

  @Prop()
  updatedBy?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}
