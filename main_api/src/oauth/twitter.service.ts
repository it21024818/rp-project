import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { uniqueId } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { GoogleScope } from 'src/common/enums/google-scopes.enum';
import { nestApp } from 'src/main';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { URLSearchParams } from 'url';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private readonly codeChallenge = uuidv4();

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async generateUrl(res: Response) {
    this.logger.log('Generating Twitter OAuth URL');
    const clientId = this.configService.get<string>(ConfigKey.TWITTER_OAUTH_CLIENT_ID);
    const redirectURL = `${this.configService.get(ConfigKey.MAIN_SERVER_BASE_URL)}v1/auth/oauth/twitter/redirect`;

    if (!clientId) {
      throw new BadRequestException(ErrorMessage.OAUTH_CLIENT_ID_NOT_FOUND, {
        description: 'Twitter OAuth client ID not found',
      });
    }

    let params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('redirect_uri', redirectURL);
    params.append('response_type', 'code');
    params.append('scope', 'users.read');
    params.append('state', uuidv4());
    params.append('code_challenge', this.codeChallenge);
    params.append('code_challenge_method', 'plain');
    const authorizeUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    this.logger.log('Generated Twitter OAuth URL');
    res.json({ authorizeUrl });
  }

  async authorizeUser(code: string) {
    try {
      const data = (
        await firstValueFrom(
          this.httpService.post(
            'https://api.x.com/2/oauth2/token',
            {
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: `${this.configService.get(ConfigKey.MAIN_SERVER_BASE_URL)}v1/auth/oauth/twitter/redirect`,
              client_id: this.configService.get(ConfigKey.TWITTER_OAUTH_CLIENT_ID),
              client_secret: this.configService.get(ConfigKey.TWITTER_OAUTH_CLIENT_SECRET),
              code_verifier: this.codeChallenge,
            },
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              auth: {
                password: this.configService.get(ConfigKey.TWITTER_OAUTH_CLIENT_SECRET) ?? '',
                username: this.configService.get(ConfigKey.TWITTER_OAUTH_CLIENT_ID) ?? '',
              },
            },
          ),
        )
      ).data;

      const accessToken = data.access_token;
      
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
}
