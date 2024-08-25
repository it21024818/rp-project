import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigKey } from "src/common/enums/config-key.enum";
import Stripe from "stripe";
import { Plan } from "./plan.schema";
import { Model } from "mongoose";
import { Request } from "express";
import { StripeEvent } from "src/common/enums/stripe-events.enum";

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

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
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${this.configService.get(ConfigKey.WEB_APP_BASE_URL)}`,
    });
    return portalSession;
  }

  async handleStripeEvent(request: Request) {
    const endpointSecret = this.configService.get(
      ConfigKey.STRIPE_WEBHOOK_ENDPOINT_SECRET
    );
    let event = request.body;
    if (endpointSecret) {
      const signature = request.headers["stripe-signature"] as string;
      try {
        event = this.stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        ) as Stripe.Event;
      } catch (err) {
        this.logger.warn(
          `⚠️  Webhook signature verification failed. Received ${signature}`,
          err.message
        );
        throw new BadRequestException();
      }
    }

    switch (event.type) {
      case StripeEvent.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END:
        await this.handleCustomerSubscriptionWillEnd(event.data.object);
        break;
      case StripeEvent.CUSTOMER_SUBSCRIPTION_DELETED:
        await this.handleCustomerSubscriptionDeleted(event.data.object);
        break;
      case StripeEvent.CUSTOMER_SUBSCRIPTION_CREATED:
        await this.handleCustomerSubscriptionCreated(event.data.object);
        break;
      case StripeEvent.ENTITLEMENTS_ACTIVE_ENTITLEMENT_SUMMARY_UPDATED:
        await this.handleEntitlementSummaryUpdated(event.data.object);
        break;
      case StripeEvent.CUSTOMER_SUBSCRIPTION_UPDATE:
        await this.handleCustomerSubscriptionUpdated(event.data.object);
        break;
      default:
        this.logger.warn(`Unhandled event type ${event.type}.`);
        break;
    }
  }

  private async handleCustomerSubscriptionCreated(
    subscription: Stripe.Subscription
  ) {}

  private async handleCustomerSubscriptionDeleted(
    subscription: Stripe.Subscription
  ) {}

  private async handleEntitlementSummaryUpdated(
    subscription: Stripe.Subscription
  ) {}

  private async handleCustomerSubscriptionWillEnd(
    subscription: Stripe.Subscription
  ) {}

  private async handleCustomerSubscriptionUpdated(
    subscription: Stripe.Subscription
  ) {}
}
