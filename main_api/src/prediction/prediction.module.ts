import { forwardRef, Module } from "@nestjs/common";
import { PredictionService } from "./prediction.service";
import { PredictionController } from "./prediction.controller";
import { HttpModule } from "@nestjs/axios";
import { PredictionFeignClient } from "./prediction.feign";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigKey } from "src/common/enums/config-key.enum";
import { MongooseModule } from "@nestjs/mongoose";
import { Prediction, PredictionSchema } from "./prediction.schema";
import { FeedbackModule } from "src/feedback/feedback.module";

@Module({
  imports: [
    forwardRef(() => FeedbackModule),
    MongooseModule.forFeature([
      { name: Prediction.name, schema: PredictionSchema },
    ]),
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
  exports: [PredictionService],
})
export class PredictionModule {}
