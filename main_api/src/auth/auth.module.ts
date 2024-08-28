import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';

@Module({
  controllers: [AuthController],
  providers: [JwtTokenService, AuthService],
  imports: [UsersModule, TokenModule, MailerModule, EmailModule],
  exports: [AuthService],
})
export class AuthModule {}
