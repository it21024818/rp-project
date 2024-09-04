import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import { GoogleScope } from 'src/common/enums/google-scopes.enum';
import { nestApp } from 'src/main';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    const redirectURL = `${this.configService.get(ConfigKey.MAIN_SERVER_BASE_URL)}v1/auth/oauth/google/redirect`;
    this.client = new OAuth2Client(
      this.configService.get(ConfigKey.GOOGLE_OAUTH_CLIENT_ID),
      this.configService.get(ConfigKey.GOOGLE_OAUTH_CLIENT_SECRET),
      redirectURL,
    );
  }

  async generateUrl(res: Response) {
    this.logger.log('Generating Google OAuth URL');
    const authorizeUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: `${GoogleScope.USER_PROFILE} ${GoogleScope.USER_EMAIL}`,
      prompt: 'consent',
    });

    res.header('Access-Control-Allow-Origin', this.configService.get(ConfigKey.WEB_APP_BASE_URL));
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    res.json({ authorizeUrl });
  }

  async authorizeUser(code: string) {
    this.logger.log('Getting user details response from google');
    const accessToken = (await this.client.getToken(code)).tokens.access_token;
    const data = (
      await firstValueFrom(
        this.httpService.post<{ email: string; given_name: string; family_name: string }>(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          null,
          { params: { access_token: accessToken } },
        ),
      )
    ).data;
    const { email, family_name: lastName, given_name: firstName } = data;

    this.logger.log(`Checking whether user with ${email} email exists`);
    let existingUser: User;
    try {
      existingUser = await this.userService.getUserByEmail(email);
    } catch (error) {
      this.logger.warn(`User with email address ${email} does not existing. Creating`);
      existingUser = await this.authService.registerOAuthUser({ email, firstName, lastName });
    }

    return await this.authService.loginUserWithoutPassword(existingUser.email);
  }
}
