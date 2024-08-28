import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleService } from './google.service';

@Controller('/auth/oauth/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  async generateUrl(@Res() res: Response) {
    await this.googleService.generateUrl(res);
  }

  @Get()
  async authorizeUser(@Query('code') code: string) {
    await this.googleService.authorizeUser(code);
  }
}
