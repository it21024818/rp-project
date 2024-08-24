import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom, Observable } from "rxjs";
import { PredictionResponseDto } from "src/common/dtos/prediction-response.dto";

@Injectable()
export class PredictionFeignClient {
  constructor(private readonly httpService: HttpService) {}

  async getPredictionForText(text: string) {
    return (
      await firstValueFrom(
        this.httpService.post<PredictionResponseDto>("predict", { text })
      )
    ).data;
  }
}
