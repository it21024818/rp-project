import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigKey } from "src/common/enums/config-key.enum";
import Stripe from "stripe";
import { Plan } from "./plan.schema";
import { Model } from "mongoose";

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Plan.name)
    private readonly planModel: Model<Plan>
  ) {
    this.stripe = new Stripe(configService.get(ConfigKey.STRIPE_PRIVATE_KEY)!, {
      apiVersion: "2024-06-20",
    });
  }

  async createCheckoutSession(planId: string) {
    const plan = await this.planModel.findById(planId);
    const session = await this.stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: plan?.stripeId,
          // price_data: {
          //   currency: "usd",
          //   unit_amount: 5000,
          //   product: "mock-id",
          //   recurring: {
          //     interval: "month",
          //   },
          // },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${this.configService.get(
        ConfigKey.WEB_APP_BASE_URL
      )}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get(
        ConfigKey.WEB_APP_BASE_URL
      )}?canceled=true`,
    });
    return session;
  }

  async createPortalSession(sessionId: string) {
    const checkoutSession = await this.stripe.checkout.sessions.retrieve(
      sessionId
    );

    // TODO: Understand how this works better.
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${this.configService.get(ConfigKey.WEB_APP_BASE_URL)}`,
    });
    return portalSession;
  }

  async handleStripeEvent() {}
}
