import { Body, Controller, Get, Post, Query, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { TwitterService } from './twitter.service';

@Controller({
  path: '/auth/oauth/twitter',
  version: '1',
})
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post()
  async generateUrl(@Res() res: Response) {
    await this.twitterService.generateUrl(res);
  }

  @Get('redirect')
  async authorizeUser(@Query('code') code: string) {
    return await this.twitterService.authorizeUser(code);
  }
}
