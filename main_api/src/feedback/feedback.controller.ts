import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateFeedbackDto } from 'src/common/dtos/create-feedback-dto';
import { FeedbackDto } from 'src/common/dtos/feedback.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Frequency } from 'src/common/enums/frequency.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { TransformDatePipe } from 'src/common/pipes/transform-date.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { FeedbackService } from './feedback.service';

@Controller({
  path: 'feedback',
  version: '1',
})
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('analytics')
  async getPoliticalBiasAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.feedbackService.getAnalytics(startDate, endDate, frequency);
  }

  @Get(':id')
  @Roles(...Object.values(UserRole))
  async getfeedback(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.feedbackService.getFeedback(id);
  }

  @Get(':id/details')
  async getfeedbackDetails(@Param('id', ValidateObjectIdPipe) id: string): Promise<FeedbackDto> {
    const results = await this.feedbackService.getFeedbackDetails(id);
    return FeedbackDto.buildWithPrediction(...results);
  }

  @Delete(':id')
  @Roles(...Object.values(UserRole))
  async deletefeedback(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.feedbackService.deleteFeedback(id);
  }

  @Post()
  async createfeedback(
    @User('_id') userId: string,
    @Query('prediction-id', ValidateObjectIdPipe) predictionId: string,
    @Body()
    { details, reaction }: CreateFeedbackDto,
  ) {
    return await this.feedbackService.createFeedback(details, reaction, predictionId, userId);
  }

  @Put(':id')
  @Roles(...Object.values(UserRole))
  async updateFeedback(
    @Param('id', ValidateObjectIdPipe) id: string,
    @User('_id') userId: string,
    @Body()
    { details, reaction }: CreateFeedbackDto,
  ) {
    return await this.feedbackService.updateFeedback(id, reaction, details, userId);
  }

  @Post('search')
  @Roles(UserRole.ADMIN)
  async getfeedbackPage(@Body() pageRequest: PageRequest) {
    return await this.feedbackService.getFeedbackPage(pageRequest);
  }
}
