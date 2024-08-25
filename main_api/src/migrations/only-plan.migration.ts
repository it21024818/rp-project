import { OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Migration } from "src/common/decorators/migration.decorator";
import { Frequency } from "src/common/enums/frequency.enum";
import { Plan } from "src/payments/plan.schema";

export class PlanMigration implements OnModuleInit {
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>
  ) {}

  @Migration("seed-only-plan-data")
  onModuleInit() {
    const plans: Plan[] = [
      {
        createdAt: new Date(),
        createdBy: "MIGRATION",
        amountPerBill: 1500,
        billingFrequency: Frequency.MONTHLY,
        name: "Basic Paid",
        stripeId: "",
        features: [
          "Prioritized Feedback",
          "No Request Throttling",
          "No Request Threshold",
        ],
      },
    ];
    this.planModel.insertMany(plans);
  }
}
