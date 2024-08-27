import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreatePredictionDto } from 'src/common/dtos/create-prediction-dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { FlatUser } from 'src/users/user.schema';
import { PredictionService } from './prediction.service';

@Controller('predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get(':id')
  async getPrediction(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.predictionService.getPrediction(id);
  }

  @Get(':id/feedback')
  async getPredictionFeedback(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.predictionService.getPredictionFeedback(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deletePrediction(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.predictionService.deletePrediction(id);
  }

  @Post()
  async createPrediction(@User('_id') userId: string, @Body() { text }: CreatePredictionDto) {
    return await this.predictionService.createPrediction(text, userId);
  }

  @Get('search')
  @Roles(...Object.values(UserRole))
  async getPredictionPage(@Body() pageRequest: PageRequest) {
    return await this.predictionService.getPredictionPage(pageRequest);
  }
}
