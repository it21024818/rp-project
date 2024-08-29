import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { Frequency } from 'src/common/enums/frequency.enum';
import { TransformDatePipe } from 'src/common/pipes/transform-date.pipe';
import { AuditedRequestService } from './audited-request.service';

@Controller('audited-requests')
export class AuditedRequestController {
  constructor(private readonly auditedRequestService: AuditedRequestService) {}

  @Get('analytics')
  async getAnalytics(
    @Query('start-date', TransformDatePipe) startDate: Date,
    @Query('end-date', TransformDatePipe) endDate: Date,
    @Query('frequency', new ParseEnumPipe(Frequency)) frequency: Frequency,
  ) {
    return await this.auditedRequestService.getAnalytics(startDate, endDate, frequency);
  }
}
