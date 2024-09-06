import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EditUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
