import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePredictionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
  @IsUrl({ allow_fragments: false, require_protocol: true, require_host: true })
  @IsNotEmpty()
  url: string;
}
