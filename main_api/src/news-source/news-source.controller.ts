import { Body, Controller, Get, Param, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Frequency } from 'src/common/enums/frequency.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { TransformDatePipe } from 'src/common/pipes/transform-date.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { NewsSourceService } from './news-source.service';

@Controller({
  path: 'news-sources',
  version: '1',
})
export class NewsSourceController {
  constructor(private readonly newsSourceService: NewsSourceService) {}

  @Get(':id')
  async getNewsSource(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.newsSourceService.getNewsSource(id);
  }

  @Post('search')
  @Roles(...Object.values(UserRole))
  async getPredictionPage(@Body() pageRequest: PageRequest) {
    return await this.newsSourceService.getPredictionPage(pageRequest);
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
