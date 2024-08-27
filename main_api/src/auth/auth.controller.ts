import { Body, Controller, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ChangePasswordRequestDto } from 'src/common/dtos/change-password-request.dto';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { LoginRequestDto } from 'src/common/dtos/login-request.dto';
import { LoginDto } from 'src/common/dtos/login.dto';
import { RefreshTokenDto } from 'src/common/dtos/refresh-token.dto';
import { ResetPasswordRequestDto } from 'src/common/dtos/reset-password-request.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() { email, password }: LoginRequestDto): Promise<LoginDto> {
    return await this.authService.loginUser(email, password);
  }

  @Post('refresh')
  async refreshTokens(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshTokens(refreshToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() userDto: CreateUserDto) {
    await this.authService.registerUser(userDto);
  }

  @Post('register/resend')
  async resendRegistrationMail(@Query() email: string) {
    await this.authService.sendRegistrationMail(email);
  }

  @Put('authorize')
  async authorizeUser(@Query('token-code') tokenCode: string) {
    await this.authService.authorizeUser(tokenCode);
  }

  @Put('password/forgot')
  async forgotUserPassword(@Query('email') email: string) {
    await this.authService.forgotUserPassword(email);
  }

  @Put('password/reset')
  async resetUserPassword(@Body() { password, tokenCode }: ResetPasswordRequestDto) {
    await this.authService.resetUserPassword(password, tokenCode);
  }

  @Put('password/change')
  @Roles(...Object.values(UserRole))
  async changeUserPassword(@User('email') email: string, @Body() { password, oldPassword }: ChangePasswordRequestDto) {
    await this.authService.changeUserPassword(email, password, oldPassword);
  }
}
