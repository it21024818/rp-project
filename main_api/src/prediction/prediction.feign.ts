import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ExtractKeywordsResponseDto } from 'src/common/dtos/extract-keywords-response.dto';
import { PredictionResponseDto } from 'src/common/dtos/prediction-response.dto';

@Injectable()
export class PredictionFeignClient {
  constructor(private readonly httpService: HttpService) {}

  async getPredictionForText(text: string) {
    return (await firstValueFrom(this.httpService.post<PredictionResponseDto>('predict', { text }))).data;
  }

  async extractKeywords(text: string) {
    return (
      await firstValueFrom(
        this.httpService.post<ExtractKeywordsResponseDto>('extract-keywords', {
          text,
        }),
      )
    ).data;
  }
}
