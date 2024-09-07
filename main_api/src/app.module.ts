import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { AuditedRequestInterceptor } from './audited-request/audited-request.interceptor';
import { AuditedRequestModule } from './audited-request/audited-request.module';
import { AuditedRequestService } from './audited-request/audited-request.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtTokenService } from './auth/jwt-token.service';
import { ConfigKey } from './common/enums/config-key.enum';
import { AuthGuard } from './common/guards/auth.guard';
import { LogGuard } from './common/guards/log.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CoreModule } from './core/core.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { FeedbackModule } from './feedback/feedback.module';
import { MigrationsModule } from './migrations/migrations.module';
import { NewsSearchModule } from './news-search/news-search.module';
import { NewsSourceModule } from './news-source/news-source.module';
import { OauthModule } from './oauth/oauth.module';
import { PaymentsModule } from './payments/payments.module';
import { PredictionModule } from './prediction/prediction.module';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TokenModule,
    EmailModule,
    HttpModule,
    AuditedRequestModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
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
          ttl: parseInt(configService.get(ConfigKey.CACHE_TTL) ?? 'invalid'),
          socket: {
            host: configService.get(ConfigKey.REDIS_HOST) ?? 'invalid',
            port: parseInt(configService.get(ConfigKey.REDIS_PORT) ?? 'invalid'),
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
    OauthModule,
    NewsSourceModule,
    CoreModule,
  ],
  providers: [
    AuthService,
    UsersService,
    TokenService,
    EmailService,
    JwtTokenService,
    AuditedRequestService,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditedRequestInterceptor,
    },
  ],
})
export class AppModule {}
