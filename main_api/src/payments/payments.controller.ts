import {
  Controller,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { Request, Response } from "express";
import ErrorMessage from "src/common/enums/error-message.enum";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout")
  async createCheckoutSession(
    @Res() res: Response,
    @Query("plan-id") subscriptionPlanId: string
  ) {
    const session = await this.paymentsService.createCheckoutSession(
      subscriptionPlanId
    );
    if (!session?.url) {
      throw new InternalServerErrorException(ErrorMessage.SESSION_URL_INVALID, {
        description: `Return url was ${session?.url}`,
      });
    }
    res.redirect(session.url);
  }

  @Post("portal")
  async createPortalSession(
    @Res() res: Response,
    @Query("session-id") sessionId: string
  ) {
    const session = await this.paymentsService.createPortalSession(sessionId);
    if (!session?.url) {
      throw new InternalServerErrorException(ErrorMessage.SESSION_URL_INVALID, {
        description: `Return url was ${session?.url}`,
      });
    }
    res.redirect(session.url);
  }

  @Post("webhook")
  async handleWebhookEvent(@Req() req: Request) {
    await this.paymentsService.handleStripeEvent(req);
  }
}
