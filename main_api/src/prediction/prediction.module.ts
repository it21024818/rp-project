import { Module } from "@nestjs/common";
import { PredictionService } from "./prediction.service";
import { PredictionController } from "./prediction.controller";
import { HttpModule } from "@nestjs/axios";
import { PredictionFeignClient } from "./prediction.feign";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigKey } from "src/common/enums/config-key.enum";

@Module({
  imports: [
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
})
export class PredictionModule {}
