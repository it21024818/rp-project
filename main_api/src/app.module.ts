import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { ConfigKey } from './common/enums/config-key.enum';
import { HttpModule } from '@nestjs/axios';
import { LogGuard } from './common/guards/log.guard';
import { JwtTokenService } from './auth/jwt-token.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { PredictionModule } from './prediction/prediction.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PaymentsModule } from './payments/payments.module';
import { NewsSearchModule } from './news-search/news-search.module';
import { MigrationsModule } from './migrations/migrations.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TokenModule,
    EmailModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.MONGO_URI || configService.get(ConfigKey.MONGO_URI),
      }),
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: parseInt(configService.get(ConfigKey.CACHE_TTL)!),
          socket: {
            host: configService.get(ConfigKey.REDIS_HOST)!,
            port: parseInt(configService.get(ConfigKey.REDIS_PORT)!),
          },
        }),
      }),
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get(ConfigKey.SMTP_HOST),
          port: 465,
          secure: true,
          auth: {
            user: configService.get(ConfigKey.SMTP_USER),
            pass: configService.get(ConfigKey.SMTP_PASS),
          },
          connectionTimeout: 1 * 60 * 1000,
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + './../assets/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    PredictionModule,
    FeedbackModule,
    PaymentsModule,
    NewsSearchModule,
    MigrationsModule,
  ],
  providers: [
    AuthService,
    UsersService,
    TokenService,
    EmailService,
    JwtTokenService,
    {
      provide: APP_GUARD,
      useClass: LogGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
