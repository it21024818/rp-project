import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { GoogleService } from './google.service';

describe('Google Test suite', () => {
  let service: GoogleService;
  let configService: ConfigService;
  let httpService: HttpService;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleService,
        { provide: AuthService, useValue: createMock<AuthService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: HttpService, useValue: createMock<HttpService>() },
      ],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
