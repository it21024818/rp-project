import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSourceModule } from 'src/news-source/news-source.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { Migration, MigrationSchema } from './migration.schema';
import { NewsSourceMockDataMigration } from './mock-data/news-source-mock-seed.migration';
import { UsersMockSeedMigration } from './mock-data/users-mock-seed.migration';
import { PlanMigration } from './seed-data/only-plan.migration';
import { UserMigration } from './seed-data/user.migration';

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    NewsSourceModule,
    MongooseModule.forFeature([{ name: Migration.name, schema: MigrationSchema }]),
  ],
  providers: [PlanMigration, UserMigration, UsersMockSeedMigration, NewsSourceMockDataMigration],
})
export class MigrationsModule {}
