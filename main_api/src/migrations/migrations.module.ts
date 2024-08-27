import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { Migration, MigrationSchema } from './migration.schema';
import { PlanMigration } from './only-plan.migration';
import { UserMigration } from './user.migration';

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    MongooseModule.forFeature([{ name: Migration.name, schema: MigrationSchema }]),
  ],
  providers: [PlanMigration, UserMigration],
})
export class MigrationsModule {}
