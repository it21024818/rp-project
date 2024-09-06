import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { NewsSearchModule } from 'src/news-search/news-search.module';
import { NewsSourceModule } from 'src/news-source/news-source.module';
import { UsersModule } from 'src/users/users.module';
import { PredictionController } from './prediction.controller';
import { PredictionFeignClient } from './prediction.feign';
import { Prediction, PredictionSchema } from './prediction.schema';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    NewsSearchModule,
    UsersModule,
    forwardRef(() => NewsSourceModule),
    forwardRef(() => FeedbackModule),
    MongooseModule.forFeature([{ name: Prediction.name, schema: PredictionSchema }]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get(ConfigKey.FEIGN_TIMEOUT),
        maxRedirects: configService.get(ConfigKey.FEIGN_MAX_REDIRECTS),
        baseURL: configService.get(ConfigKey.AI_SERVER_BASE_URL),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PredictionService, PredictionFeignClient],
  controllers: [PredictionController],
  exports: [PredictionService, MongooseModule],
})
export class PredictionModule {}
