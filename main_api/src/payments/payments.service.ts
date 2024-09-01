import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentStrategyKey } from './paymeny-stategy-key.enum';

@Injectable()
export class PaymentsService {
  private paymentStrategyByKey = new Map<PaymentStrategyKey, PaymentStrategy>();
  private readonly logger = new Logger(PaymentsService.name);

  public getStrategy(key: PaymentStrategyKey): PaymentStrategy {
    const result = this.paymentStrategyByKey.get(key);
    if (!result) {
      throw new BadRequestException(ErrorMessage.PAYMENT_STRATEGY_NOT_FOUND, {
        description: `Payment strategy with key ${key} not found`,
      });
    }
    return result;
  }

  public register(key: PaymentStrategyKey, strategy: PaymentStrategy) {
    this.logger.log(`Registering new payment strategy '${key}'`);
    this.paymentStrategyByKey.set(key, strategy);
  }

  async createCheckoutSession(strategy: PaymentStrategyKey, planId: string, userId: string): Promise<string> {
    this.logger.log(`Attempting to create new checkout session with strategy '${strategy}'`);
    return await this.paymentStrategyByKey.get(strategy)!.createCheckoutSession(planId, userId);
  }

  async createPortalSession(strategy: PaymentStrategyKey, sessionId: string): Promise<string> {
    this.logger.log(`Attempting to create new portal session with strategy '${strategy}'`);
    return await this.paymentStrategyByKey.get(strategy)!.createPortalSession(sessionId);
  }

  async handleEvent(strategy: PaymentStrategyKey, request: Request): Promise<void> {
    this.logger.log(`Attempted to handle and event with strategy '${strategy}'`);
    return await this.paymentStrategyByKey.get(strategy)!.handleEvent(request);
  }
}
