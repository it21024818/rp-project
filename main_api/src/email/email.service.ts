import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailPurpose } from '../common/enums/email-purpose.enum';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, purpose: EmailPurpose, data?: any) {
    const emailData = EmailPurpose[purpose];

    this.mailerService
      .sendMail({
        to,
        from: 'noreply@lighthouse.com',
        subject: emailData.subject,
        template: emailData.template,
        context: data,
      })
      .then(() => {
        this.logger.log(`Successfully sent '${purpose}' email to user with email ${to}`);
      })
      .catch(err => {
        this.logger.error(`Could not send '${purpose}' email to user with email '${to}'`, err);
      });
  }
}
