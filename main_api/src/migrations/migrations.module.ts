import { Module } from "@nestjs/common";
import { UserMigration } from "./user.migration";
import { PlanMigration } from "./only-plan.migration";
import { UsersModule } from "src/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Migration, MigrationSchema } from "./migration.schema";
import { PaymentsModule } from "src/payments/payments.module";

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    MongooseModule.forFeature([
      { name: Migration.name, schema: MigrationSchema },
    ]),
  ],
  providers: [PlanMigration, UserMigration],
})
export class MigrationsModule {}
