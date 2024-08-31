import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { Migration, MigrationSchema } from './migration.schema';
import { UsersMockSeedMigration } from './mock-data/users-mock-seed.migration';
import { PlanMigration } from './seed-data/only-plan.migration';
import { UserMigration } from './seed-data/user.migration';

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    MongooseModule.forFeature([{ name: Migration.name, schema: MigrationSchema }]),
  ],
  providers: [PlanMigration, UserMigration, UsersMockSeedMigration],
})
export class MigrationsModule {}
