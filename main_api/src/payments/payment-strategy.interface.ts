import { Request } from 'express';

export interface PaymentStrategy {
  onModuleInit(): void; // Register on this
  createCheckoutSession(planId: string, userId: string): Promise<string>;
  createPortalSession(sessionId: string): Promise<string>;
  handleEvent(request: Request): Promise<void>;
}
