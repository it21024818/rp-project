import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Audience } from '../enums/audience.enum';

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Audience)
  @IsNotEmpty()
  audience: Audience;
}
