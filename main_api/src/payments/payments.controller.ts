import { Controller, Param, ParseEnumPipe, Post, Query, RawBodyRequest, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { ToUpperPipe } from 'src/common/pipes/to-upper.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { PaymentsService } from './payments.service';
import { PaymentStrategyKey } from './paymeny-stategy-key.enum';


@Controller({
  path: 'payments/:strategy',
  version: '1',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @Roles(...Object.values(UserRole))
  async createCheckoutSession(
    @Param('strategy', ToUpperPipe, new ParseEnumPipe(PaymentStrategyKey)) strategy: PaymentStrategyKey,
    @User('_id') userId: string,
    @Query('plan-id', ValidateObjectIdPipe) subscriptionPlanId: string,
  ) {
    const url = await this.paymentsService.createCheckoutSession(strategy, subscriptionPlanId, userId);
    return { url };
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
    @Req() req: RawBodyRequest<Request>,
    @Param('strategy', ToUpperPipe, new ParseEnumPipe(PaymentStrategyKey)) strategy: PaymentStrategyKey,
  ) {
    await this.paymentsService.handleEvent(strategy, req);
  }
}