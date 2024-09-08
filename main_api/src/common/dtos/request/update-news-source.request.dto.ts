import { IsArray, IsOptional, IsString } from 'class-validator';
import { NewsSource } from 'src/news-source/news-source.schema';

export class UpdateNewsSourceRequestDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsArray()
  @IsString({ each: true })
  identifications: string[];
  @IsString()
  @IsOptional()
  domain: string;
}
