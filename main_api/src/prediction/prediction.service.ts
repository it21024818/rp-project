import { Injectable } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionFeignClient } from './prediction.feign';
import { FlatUser } from 'src/users/user.schema';
import { MongooseUtil } from 'src/common/util/mongoose.util';
import { InjectModel } from '@nestjs/mongoose';
import { Prediction } from './prediction.schema';
import { Model } from 'mongoose';

@Injectable()
export class PredictionService {
  constructor(private readonly predictionFeignClient: PredictionFeignClient,
    @InjectModel(Prediction.name) private readonly predictionModel: Model<Prediction>
  ) {}

  async getPrediction(id: string) {}

  async deletePrediction(id: string) {}

  async createPrediction(text: string, user: FlatUser) {
    const predictionResult = await this.predictionFeignClient.getPredictionForText(text);
  }

  async getPredictionPage(pageRequest: PageRequest) {
    return await MongooseUtil.getDocumentPage(this.predictionModel, pageRequest);
  }
}
