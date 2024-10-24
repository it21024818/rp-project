import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { WriteStream } from 'fs';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreatePredictionDto } from 'src/common/dtos/create-prediction-dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionDto } from 'src/common/dtos/prediction.dto';
import { GetPredictionAsFileRequestDto } from 'src/common/dtos/request/get-prediction-as-file.request.dto';
import { Frequency } from 'src/common/enums/frequency.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { TransformDatePipe } from 'src/common/pipes/transform-date.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { Stream } from 'stream';
import { ReadableStream } from 'stream/web';
import { PredictionService } from './prediction.service';

@Controller({
  path: 'predictions',
  version: '1',
})
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get(':id')
  async getPrediction(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.predictionService.getPrediction(id);
  }

  @Get(':id/details')
  async getPredictionDetails(@Param('id', ValidateObjectIdPipe) id: string) {
    const details = await this.predictionService.getPredictionDetails(id);
    return PredictionDto.buildWithAll(...details);
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
  @HttpCode(HttpStatus.CREATED)
  @Roles(...Object.values(UserRole))
  async createPrediction(@User('_id') userId: string, @Body() { text, url }: CreatePredictionDto) {
    return await this.predictionService.createPrediction(text, url, userId);
  }

  @Get('report/:type')
  async getPredictionsAsFile(
    @Res() res: Response,
    @User('_id') userId: string,
    @Param('type') type: string,
    @Query() options: GetPredictionAsFileRequestDto,
  ) {
    const workbook = await this.predictionService.getPredictionsAsWorkbook(userId, options);
    if (type === 'xlsx') {
      const buffer = await workbook.xlsx.writeBuffer();
      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } else if (type === 'csv') {
      const buffer = await workbook.csv.writeBuffer();
      res.set('Content-Type', 'text/csv');
      res.send(buffer);
    } else {
      throw new BadRequestException('Invalid report type');
    }
  }

  @Post('search')
  @Roles(...Object.values(UserRole))
  async getPredictionPage(@Body() pageRequest: PageRequest) {
    return await this.predictionService.getPredictionPage(pageRequest);
  }

  @Get('analytics/final')
  async getFinalAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.predictionService.getFinalAnalytics(startDate, endDate, frequency);
  }

  @Get('analytics/sarcasm')
  async getSarcasmAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.predictionService.getSarcAnalytics(startDate, endDate, frequency);
  }

  @Get('analytics/sentiment')
  async getSentimentAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.predictionService.getSentimentAnalytics(startDate, endDate, frequency);
  }

  @Get('analytics/text-quality')
  async getTextQualityAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.predictionService.getTextAnalytics(startDate, endDate, frequency);
  }

  @Get('analytics/political-bias')
  async getPoliticalBiasAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.predictionService.getBiasAnalytics(startDate, endDate, frequency);
  }
}
