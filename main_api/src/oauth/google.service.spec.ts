import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Response, response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { when } from 'jest-when';
import { of } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/common/dtos/login.dto';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import { UsersService } from 'src/users/users.service';
import { GoogleService } from './google.service';

describe('Google Test suite', () => {
  let service: GoogleService;
  let httpService: HttpService;
  let usersService: UsersService;
  let authService: AuthService;
  let client: OAuth2Client;
  let mainServerBaseUrl: string = 'http://localhost:3000';
  let googleClientId: string = 'google-client-id';
  let googleClientSecret: string = 'secret';
  let webAppBaseUrl: string = 'http://localhost/';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleService,
        { provide: AuthService, useValue: createMock<AuthService>() },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: ConfigKey) => {
              switch (key) {
                case ConfigKey.MAIN_SERVER_BASE_URL:
                  return mainServerBaseUrl;
                case ConfigKey.GOOGLE_OAUTH_CLIENT_ID:
                  return googleClientId;
                case ConfigKey.GOOGLE_OAUTH_CLIENT_SECRET:
                  return googleClientSecret;
                case ConfigKey.WEB_APP_BASE_URL:
                  return webAppBaseUrl;
              }
            }),
          },
        },
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: HttpService, useValue: createMock<HttpService>() },
      ],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
    client = service['client'];
    httpService = module.get<HttpService>(HttpService);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateUrl', () => {
    it('should generate Google OAuth URL and return it in the response', async () => {
      // 1st part: variable declarations
      const authorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?';
      const response = createMock<Response>();

      // 2nd part: spies and expected behavior
      const generateAuthUrlSpy = jest.spyOn(client, 'generateAuthUrl');
      when(generateAuthUrlSpy)
        .calledWith({
          access_type: 'offline',
          scope: 'profile email',
          prompt: 'consent',
        })
        .mockReturnValue(authorizeUrl);

      // 3rd part: call the function being tested
      await service.generateUrl(response);

      // Assertions
      expect(generateAuthUrlSpy).toHaveBeenCalledTimes(1);
      expect(response.header).toHaveBeenCalledWith('Access-Control-Allow-Origin', webAppBaseUrl);
      expect(response.header).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
      expect(response.header).toHaveBeenCalledWith('Referrer-Policy', 'no-referrer-when-downgrade');
      expect(response.json).toHaveBeenCalledWith({
        authorizeUrl:
          'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&prompt=consent&response_type=code&client_id=google-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A3000v1%2Fauth%2Foauth%2Fgoogle%2Fredirect',
      });
    });
  });

  describe('authorizeUser', () => {
    it('should authorize the user and log them in if they exist', async () => {
      // 1st part: variable declarations
      const code = 'test-code';
      const mockAccessToken = 'test-access-token';
      const mockData = {
        email: 'test@example.com',
        given_name: 'Test',
        family_name: 'User',
      };
      const mockUser = { id: 'test-user-id', email: 'test@example.com' };
      const mockCredentials = { strategies: [{ type: 'GOOGLE_OAUTH' }] };
      const mockTokenResponse = { tokens: { access_token: mockAccessToken } };
      const mockLoginResult: LoginDto = {
        tokens: { accessToken: mockAccessToken, refreshToken: '' },
        user: { email: mockData.email, firstName: mockData.given_name, lastName: mockData.family_name },
      };

      // 2nd part: spies and expected behavior
      const getTokenSpy = jest.spyOn(client, 'getToken');
      when(getTokenSpy)
        .calledWith(code as any)
        .mockResolvedValue(mockTokenResponse as never);

      const postSpy = jest.spyOn(httpService, 'post');
      when(postSpy)
        .calledWith('https://www.googleapis.com/oauth2/v3/userinfo', null, {
          params: { access_token: mockAccessToken },
        })
        .mockReturnValue(of({ data: mockData }) as any);

      const getUserByEmailSpy = jest.spyOn(usersService, 'getUserByEmail');
      when(getUserByEmailSpy)
        .calledWith(mockData.email)
        .mockResolvedValue(mockUser as never);

      const getCredentialsSpy = jest.spyOn(authService, 'getCredentials');
      when(getCredentialsSpy)
        .calledWith(mockUser.id)
        .mockResolvedValue(mockCredentials as any);

      const loginUserWithOAuthSpy = jest.spyOn(authService, 'loginUserWithOAuth');
      when(loginUserWithOAuthSpy).calledWith(mockUser.email, 'GOOGLE_OAUTH').mockResolvedValue(mockLoginResult);

      // 3rd part: call the function being tested
      const result = await service.authorizeUser(code);

      // Assertions
      expect(getTokenSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
      expect(getCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(loginUserWithOAuthSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockLoginResult);
    });

    it('should register and log in the user if they do not exist', async () => {
      // 1st part: variable declarations
      const code = 'test-code';
      const mockAccessToken = 'test-access-token';
      const mockData = {
        email: 'test@example.com',
        given_name: 'Test',
        family_name: 'User',
      };
      const mockUser = { id: 'new-user-id', email: 'test@example.com' };
      const mockTokenResponse = { tokens: { access_token: mockAccessToken } };
      const mockLoginResult: LoginDto = {
        tokens: { accessToken: mockAccessToken, refreshToken: '' },
        user: { email: mockData.email, firstName: mockData.given_name, lastName: mockData.family_name },
      };

      // 2nd part: spies and expected behavior
      const getTokenSpy = jest.spyOn(client, 'getToken');
      when(getTokenSpy)
        .calledWith(code as any)
        .mockResolvedValue(mockTokenResponse as never);

      const postSpy = jest.spyOn(httpService, 'post');
      when(postSpy)
        .calledWith('https://www.googleapis.com/oauth2/v3/userinfo', null, {
          params: { access_token: mockAccessToken },
        })
        .mockReturnValue(of({ data: mockData }) as any);

      const getUserByEmailSpy = jest.spyOn(usersService, 'getUserByEmail');
      when(getUserByEmailSpy)
        .calledWith(mockData.email)
        .mockRejectedValue(new Error('User not found') as never);

      const registerOAuthUserSpy = jest.spyOn(authService, 'registerOAuthUser');
      when(registerOAuthUserSpy)
        .calledWith(
          { email: mockData.email, firstName: mockData.given_name, lastName: mockData.family_name },
          'GOOGLE_OAUTH',
        )
        .mockResolvedValue(mockUser as any);

      const loginUserWithOAuthSpy = jest.spyOn(authService, 'loginUserWithOAuth');
      when(loginUserWithOAuthSpy).calledWith(mockUser.email, 'GOOGLE_OAUTH').mockResolvedValue(mockLoginResult);

      // 3rd part: call the function being tested
      const result = await service.authorizeUser(code);

      // Assertions
      expect(getTokenSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(getUserByEmailSpy).toHaveBeenCalledTimes(1);
      expect(registerOAuthUserSpy).toHaveBeenCalledTimes(1);
      expect(loginUserWithOAuthSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockLoginResult);
    });
  });
});
