import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
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
        this.httpService.post<string[]>('extract-keywords', {
          text,
        }),
      )
    ).data;
  }
}
