import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import dayjs from 'dayjs';

export class GetPredictionAsFileRequestDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsOptional()
  @Transform(({ value }) => new Boolean(value))
  includeFeedback?: boolean;
}
