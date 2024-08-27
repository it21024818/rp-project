import { Controller, InternalServerErrorException, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @Roles(...Object.values(UserRole))
  async createCheckoutSession(
    @Res() res: Response,
    @User('_id') userId: string,
    @Query('plan-id') subscriptionPlanId: string,
  ) {
    const session = await this.paymentsService.createCheckoutSession(subscriptionPlanId, userId);
    if (!session?.url) {
      throw new InternalServerErrorException(ErrorMessage.SESSION_URL_INVALID, {
        description: `Return url was ${session?.url}`,
      });
    }
    res.redirect(session.url);
  }

  @Post('portal')
  @Roles(...Object.values(UserRole))
  async createPortalSession(@Res() res: Response, @Query('session-id') sessionId: string) {
    const session = await this.paymentsService.createPortalSession(sessionId);
    if (!session?.url) {
      throw new InternalServerErrorException(ErrorMessage.SESSION_URL_INVALID, {
        description: `Return url was ${session?.url}`,
      });
    }
    res.redirect(session.url);
  }

  @Post('webhook')
  async handleWebhookEvent(@Req() req: Request) {
    await this.paymentsService.handleStripeEvent(req);
  }
}
