import { Controller, InternalServerErrorException, Param, ParseEnumPipe, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { ToUpperPipe } from 'src/common/pipes/to-upper.pipe';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentsService } from './payments.service';
import { PaymentStrategyKey } from './paymeny-stategy-key.enum';

@Controller('payments/:strategy')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @Roles(...Object.values(UserRole))
  async createCheckoutSession(
    @Res() res: Response,
    @Param('strategy', ToUpperPipe, new ParseEnumPipe(PaymentStrategyKey)) strategy: PaymentStrategyKey,
    @User('_id') userId: string,
    @Query('plan-id') subscriptionPlanId: string,
  ) {
    const url = await this.paymentsService.createCheckoutSession(strategy, subscriptionPlanId, userId);
    res.redirect(url);
  }

  @Post('portal')
  @Roles(...Object.values(UserRole))
  async createPortalSession(
    @Res() res: Response,
    @Param('strategy', ToUpperPipe, new ParseEnumPipe(PaymentStrategyKey)) strategy: PaymentStrategyKey,
    @Query('session-id') sessionId: string,
  ) {
    const url = await this.paymentsService.createPortalSession(strategy, sessionId);
    res.redirect(url);
  }

  @Post('webhook')
  async handleWebhookEvent(
    @Req() req: Request,
    @Param('strategy', ToUpperPipe, new ParseEnumPipe(PaymentStrategyKey)) strategy: PaymentStrategyKey,
  ) {
    await this.paymentsService.handleEvent(strategy, req);
  }
}
