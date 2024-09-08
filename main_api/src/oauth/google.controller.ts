import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleService } from './google.service';

@Controller({
  path: '/auth/oauth/google',
  version: '1',
})
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  async generateUrl(@Res() res: Response) {
    return await this.googleService.generateUrl(res);
  }

  @Get('redirect')
  async authorizeUser(@Query('code') code: string) {
    return await this.googleService.authorizeUser(code);
  }
}
