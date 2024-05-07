import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  tokenCode: string;
}
