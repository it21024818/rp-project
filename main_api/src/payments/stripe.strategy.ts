import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { StripeEvent } from 'src/common/enums/stripe-events.enum';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentsService } from './payments.service';
import { PaymentStrategyKey } from './paymeny-stategy-key.enum';
import { Plan } from './plan.schema';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeStrategy.name);
  private readonly STRIPE_STATUS_MAPPING: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: SubscriptionStatus.ACTIVE,
    trialing: SubscriptionStatus.ACTIVE,
    paused: SubscriptionStatus.PAUSED,
    unpaid: SubscriptionStatus.PAUSED,
    incomplete: SubscriptionStatus.PAUSED,
    incomplete_expired: SubscriptionStatus.PAUSED,
    canceled: SubscriptionStatus.ENDED,
    past_due: SubscriptionStatus.ENDED,
  };

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectModel(Plan.name)
    private readonly planModel: Model<Plan>,
  ) {
    const stripeKey = configService.get(ConfigKey.STRIPE_PRIVATE_KEY);
    if (!stripeKey) {
      throw new InternalServerErrorException(ErrorMessage.CONFIG_ERROR, {
        description: 'Stripe private key not found',
      });
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
    });
  }

  onModuleInit(): void {
    this.paymentsService.register(PaymentStrategyKey.STRIPE, this);
  }

  private async getCustomer(userId: string): Promise<Stripe.Customer> {
    this.logger.log(`Fetching customer for user ${userId}...`);
    const user = await this.usersService.getUser(userId);
    let customer: Stripe.Customer;
    if (user.stripeCustomerId) {
      this.logger.log(
        `Customer already exists for user ${userId}. Fetching customer details for id ${user.stripeCustomerId}...`,
      );
      const customerResponse = await this.stripe.customers.retrieve(user.stripeCustomerId);
      if (customerResponse.deleted) {
        throw new BadRequestException(ErrorMessage.CUSTOMER_DELETED, {
          description: `Customer for user ${userId}  has been deleted`,
        });
      }
      customer = customerResponse;
    } else {
      this.logger.warn(`Customer not found. Creating new customer for user ${userId}...`);
      customer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: userId,
        },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }
    return customer;
  }

  async createCheckoutSession(planId: string, userId: string) {
    const plan = await this.planModel.findById(planId);
    const customer = await this.getCustomer(userId);
    const session = await this.stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: plan?.stripeId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: 'subscription',
      success_url: `${this.configService.get(
        ConfigKey.WEB_APP_BASE_URL,
      )}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get(ConfigKey.WEB_APP_BASE_URL)}?canceled=true`,
    });
    if (!session.url) {
      throw new InternalServerErrorException(ErrorMessage.SESSION_URL_INVALID, {
        description: `Return url was ${session?.url}`,
      });
    }

    return session.url;
  }

  async createPortalSession(sessionId: string) {
    const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId);
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${this.configService.get(ConfigKey.WEB_APP_BASE_URL)}`,
    });
    return portalSession.url;
  }

  async handleEvent(request: Request) {
    const endpointSecret = this.configService.get(ConfigKey.STRIPE_WEBHOOK_ENDPOINT_SECRET);
    let event = request.body;
    if (endpointSecret) {
      const signature = request.headers['stripe-signature'] as string;
      try {
        event = this.stripe.webhooks.constructEvent(request.body, signature, endpointSecret) as Stripe.Event;
      } catch (err) {
        this.logger.warn(`⚠️  Webhook signature verification failed. Received ${signature}`, err.message);
        throw new BadRequestException();
      }
    }

    this.logger.log(`Received stripe event ${event.type}`);
    switch (event.type) {
      case StripeEvent.CUSTOMER_SUBSCRIPTION_DELETED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_CREATED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_UPDATE:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_PAUSED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_RESUMED:
        await this.handleCustomerSubscriptionUpdated(event.data.object);
        break;
      default:
        this.logger.warn(`Skipping unhandled stripe event type ${event.type}.`);
        break;
    }
  }

  private async handleCustomerSubscriptionUpdated(subscription: Stripe.Subscription) {
    const user = await this.usersService.getUserByStripeCustomerId(subscription.customer as string);
    const planId = subscription.items.data[0].price.id as string;
    user.subscription = {
      id: subscription.id,
      status: this.STRIPE_STATUS_MAPPING[subscription.status],
      planId: planId,
      startedTs: new Date(subscription.current_period_start),
      endingTs: new Date(subscription.current_period_end),
    };
    await user.save();
  }
}
