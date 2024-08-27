import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Plan, PlanSchema } from './plan.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]), UsersModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [MongooseModule],
})
export class PaymentsModule {}
