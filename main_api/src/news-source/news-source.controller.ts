import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { Frequency } from 'src/common/enums/frequency.enum';
import { TransformDatePipe } from 'src/common/pipes/transform-date.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { NewsSourceService } from './news-source.service';

@Controller('news-sources')
export class NewsSourceController {
  constructor(private readonly newsSourceService: NewsSourceService) {}

  @Get(':id')
  async getNewsSource(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.newsSourceService.getNewsSource(id);
  }

  @Get(':id/analytics/final')
  async getFinalAnalytics(
    @Param('id', ValidateObjectIdPipe) newsSourceId: string,
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.newsSourceService.getFinalAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  @Get(':id/analytics/sarcasm')
  async getSarcasmAnalytics(
    @Param('id', ValidateObjectIdPipe) newsSourceId: string,
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.newsSourceService.getSarcAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  @Get(':id/analytics/sentiment')
  async getSentimentAnalytics(
    @Param('id', ValidateObjectIdPipe) newsSourceId: string,
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.newsSourceService.getSentimentAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  @Get(':id/analytics/text-quality')
  async getTextQualityAnalytics(
    @Param('id', ValidateObjectIdPipe) newsSourceId: string,
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.newsSourceService.getTextAnalytics(startDate, endDate, frequency, newsSourceId);
  }

  @Get(':id/analytics/political-bias')
  async getPoliticalBiasAnalytics(
    @Param('id', ValidateObjectIdPipe) newsSourceId: string,
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.newsSourceService.getBiasAnalytics(startDate, endDate, frequency, newsSourceId);
  }
}
