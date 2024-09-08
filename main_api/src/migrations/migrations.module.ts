import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { NewsSourceModule } from 'src/news-source/news-source.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { PredictionModule } from 'src/prediction/prediction.module';
import { UsersModule } from 'src/users/users.module';
import { Migration, MigrationSchema } from './migration.schema';
import { FeedbackMockDataMigration } from './mock-data/feedback-mock-seed.migration';
import { NewsSourceMockDataMigration } from './mock-data/news-source-mock-seed.migration';
import { PredictionsMockDataMigration } from './mock-data/predictions-mock-seed.migration';
import { UsersMockSeedMigration } from './mock-data/users-mock-seed.migration';
import { AdminCredentialsSeedDataMigration } from './seed-data/admin-credentials-seed-data.migration';
import { PlanMigration } from './seed-data/only-plan.migration';
import { UserMigration } from './seed-data/user.migration';

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    NewsSourceModule,
    PredictionModule,
    FeedbackModule,
    MongooseModule.forFeature([{ name: Migration.name, schema: MigrationSchema }]),
    AuthModule,
  ],
  providers: [
    PlanMigration,
    UserMigration,
    UsersMockSeedMigration,
    NewsSourceMockDataMigration,
    PredictionsMockDataMigration,
    FeedbackMockDataMigration,
    AdminCredentialsSeedDataMigration,
  ],
})
export class MigrationsModule {}
