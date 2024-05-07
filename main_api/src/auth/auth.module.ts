import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/token/token.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from 'src/email/email.module';
import { JwtTokenService } from './jwt-token.service';

@Module({
  controllers: [AuthController],
  providers: [JwtTokenService, AuthService],
  imports: [
    UsersModule,
    TokenModule,
    MailerModule,
    EmailModule,
  ],
})
export class AuthModule {}
