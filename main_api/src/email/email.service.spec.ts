import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailPurpose } from '../common/enums/email-purpose.enum';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send an email', async () => {
      const to = 'test@example.com';
      const purpose: EmailPurpose = 'RESET_PASSWORD';

      await service.sendMail(to, purpose);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to,
        from: 'noreply@sera.com',
        subject: 'Sera - Reset your password',
        template: 'reset-password',
        context: undefined,
      });
    });
  });
});
