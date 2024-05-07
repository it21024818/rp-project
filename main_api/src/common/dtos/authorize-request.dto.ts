import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthorizeRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  tokenCode: string;
}
