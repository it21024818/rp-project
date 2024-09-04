import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Credentials, CredentialsSchema } from './credentials.schema';
import { JwtTokenService } from './jwt-token.service';

@Module({
  controllers: [AuthController],
  providers: [JwtTokenService, AuthService],
  imports: [
    UsersModule,
    TokenModule,
    MailerModule,
    EmailModule,
    MongooseModule.forFeature([{ name: Credentials.name, schema: CredentialsSchema }]),
  ],
  exports: [AuthService, JwtTokenService, MongooseModule],
})
export class AuthModule {}
