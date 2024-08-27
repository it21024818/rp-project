import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
