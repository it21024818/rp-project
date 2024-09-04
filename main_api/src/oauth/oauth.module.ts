import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [UsersModule, AuthModule, HttpModule, ConfigModule],
  providers: [GoogleService],
  controllers: [GoogleController],
})
export class OauthModule {}
