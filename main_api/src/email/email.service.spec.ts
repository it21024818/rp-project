import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { EmailPurpose } from 'src/common/enums/email-purpose.enum';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmailService, { provide: MailerService, useValue: { sendMail: jest.fn() } }],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email successfully', async () => {
    const sendMailMock = jest.spyOn(mailerService, 'sendMail');
    const emailPurpose = EmailPurpose.SIGN_UP; // Example email purpose
    const data = { name: 'John Doe' };
    const to = 'john@example.com';

    when(sendMailMock)
      .expectCalledWith({
        to,
        from: 'noreply@lighthouse.com',
        subject: emailPurpose.subject,
        template: emailPurpose.template,
        context: data,
      })
      .mockResolvedValue({});

    await service.sendMail(to, 'SIGN_UP', data);
  });

  it('should not send an email and fail gracefully', async () => {
    const sendMailMock = jest.spyOn(mailerService, 'sendMail');
    const emailPurpose = EmailPurpose.SIGN_UP; // Example email purpose
    const data = { name: 'John Doe' };
    const to = 'john@example.com';

    when(sendMailMock)
      .expectCalledWith({
        to,
        from: 'noreply@lighthouse.com',
        subject: emailPurpose.subject,
        template: emailPurpose.template,
        context: data,
      })
      .mockRejectedValue({});

    await service.sendMail(to, 'SIGN_UP', data);
  });
});
