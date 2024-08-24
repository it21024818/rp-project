import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { PredictionService } from './prediction.service';

@Controller('predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get(':id')
  async getPrediction(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.predictionService.getPrediction(id);
  }

  @Delete(':id')
  async deletePrediction(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.predictionService.deletePrediction(id);
  }

  @Post()
  async createPrediction(@Body() { text }: CreatePredictionDto) {
    return await this.predictionService.createPrediction(text);
  }

  @Get("search")
  async getPredictionPage(@Body() pageRequest: PageRequest) {
    return await this.predictionService.getPredictionPage(pageRequest);
  }
}
