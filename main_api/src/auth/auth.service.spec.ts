import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import { when } from 'jest-when';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { TokenFamily } from 'src/common/dtos/token-family.dto';
import { Audience } from 'src/common/enums/audience.enum';
import { AuthType } from 'src/common/enums/auth-type.enum';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { TokenPurpose } from 'src/common/enums/token-purpose.enum';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Credentials } from './credentials.schema';
import { JwtTokenService } from './jwt-token.service';

describe('AuthService Test suite', () => {
  let service: AuthService;
  let usersService: UsersService;
  let tokenService: TokenService;
  let emailService: EmailService;
  let jwtTokenService: JwtTokenService;
  let cache: Cache;
  let userModel: Model<User>;
  let credentialModel: Model<Credentials>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: TokenService, useValue: createMock<TokenService>() },
        { provide: EmailService, useValue: createMock<EmailService>() },
        { provide: JwtTokenService, useValue: createMock<JwtTokenService>() },
        { provide: CACHE_MANAGER, useValue: createMock<Cache>() },
        { provide: getModelToken(User.name), useValue: createMock<Model<User>>() },
        { provide: getModelToken(Credentials.name), useValue: createMock<Model<Credentials>>() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
    emailService = module.get<EmailService>(EmailService);
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
    cache = module.get<Cache>(CACHE_MANAGER);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    credentialModel = module.get<Model<Credentials>>(getModelToken(Credentials.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refreshTokens', () => {
    it('should successfully refresh tokens and update cache', async () => {
      // Given
      const oldRefreshToken = 'oldRefreshToken';
      const oldAccessToken = 'activeAccessToken';
      const id = 'user-id';
      const aud: Audience = Audience.ADMIN_APP;
      const tokenFamily: TokenFamily = {
        userId: id,
        activeAccessToken: oldAccessToken,
        activeRefreshToken: oldRefreshToken,
        oldAccessTokens: [],
        oldRefreshTokens: [],
      };
      const newAccessToken = 'newAccessToken';
      const newRefreshToken = 'newRefreshToken';

      const jwtTokenService_getPayload = jest.spyOn(jwtTokenService, 'getPayload');
      const cacheManager_get = jest.spyOn(cache, 'get');
      const jwtTokenService_getAccessToken = jest.spyOn(jwtTokenService, 'getAccessToken');
      const jwtTokenService_getRefreshToken = jest.spyOn(jwtTokenService, 'getRefreshToken');
      const cacheManager_set = jest.spyOn(cache, 'set');

      when(jwtTokenService_getPayload)
        .calledWith(oldRefreshToken)
        .mockResolvedValue({ sub: id, aud } as never);
      when(cacheManager_get)
        .calledWith(id)
        .mockResolvedValue(tokenFamily as never);
      when(jwtTokenService_getAccessToken)
        .calledWith(id, aud)
        .mockResolvedValue(newAccessToken as never);
      when(jwtTokenService_getRefreshToken)
        .calledWith(id, aud)
        .mockResolvedValue(newRefreshToken as never);

      // When
      const result = await service.refreshTokens(oldRefreshToken);

      // Then
      expect(result).toEqual({ tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
      expect(cacheManager_set).toHaveBeenCalledWith(id, {
        userId: id,
        activeAccessToken: newAccessToken,
        activeRefreshToken: newRefreshToken,
        oldAccessTokens: [oldAccessToken],
        oldRefreshTokens: [oldRefreshToken],
      });
    });

    it('should throw ForbiddenException if token family is not found in cache', async () => {
      // Given
      const oldRefreshToken = 'oldRefreshToken';
      const id = 'user-id';
      const aud: Audience = Audience.ADMIN_APP;

      const jwtTokenService_getPayload = jest.spyOn(jwtTokenService, 'getPayload');
      const cacheManager_get = jest.spyOn(cache, 'get');

      when(jwtTokenService_getPayload)
        .calledWith(oldRefreshToken)
        .mockResolvedValue({ sub: id, aud } as never);
      when(cacheManager_get)
        .calledWith(id)
        .mockResolvedValue(undefined as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.refreshTokens(oldRefreshToken);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(ForbiddenException);
    });

    it('should throw ForbiddenException if old refresh token is used', async () => {
      // Given
      const oldRefreshToken = 'oldRefreshToken';
      const id = 'user-id';
      const aud: Audience = Audience.ADMIN_APP;

      const tokenFamily: TokenFamily = {
        userId: id,
        activeAccessToken: 'activeAccessToken',
        activeRefreshToken: 'differentRefreshToken',
        oldAccessTokens: [],
        oldRefreshTokens: [],
      };

      const jwtTokenService_getPayload = jest.spyOn(jwtTokenService, 'getPayload');
      const cacheManager_get = jest.spyOn(cache, 'get');
      const cacheManager_del = jest.spyOn(cache, 'del');

      when(jwtTokenService_getPayload)
        .calledWith(oldRefreshToken)
        .mockResolvedValue({ sub: id, aud } as never);
      when(cacheManager_get)
        .calledWith(id)
        .mockResolvedValue(tokenFamily as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.refreshTokens(oldRefreshToken);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(ForbiddenException);
      expect(cacheManager_del).toHaveBeenCalledWith(id);
    });
  });

  describe('loginUser', () => {
    it('should successfully login a user with correct credentials', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'correct-password';
      const aud: Audience = Audience.ADMIN_APP;
      const existingUser = { id: 'user-id', email, toJSON: jest.fn() };
      const credentials = {
        strategies: [{ type: AuthType.EMAIL_PASSWORD, password: 'hashed-password' }],
      } as Credentials;
      const accessToken = 'newAccessToken';
      const refreshToken = 'newRefreshToken';

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      const service_getCredentials = jest.spyOn(service, 'getCredentials');
      const jwtTokenService_getAccessToken = jest.spyOn(jwtTokenService, 'getAccessToken');
      const jwtTokenService_getRefreshToken = jest.spyOn(jwtTokenService, 'getRefreshToken');
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      const cacheManager_set = jest.spyOn(cache, 'set');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(existingUser as never);
      when(service_getCredentials)
        .calledWith(existingUser.id)
        .mockResolvedValue(credentials as never);
      when(jwtTokenService_getAccessToken)
        .calledWith(existingUser.id, aud)
        .mockResolvedValue(accessToken as never);
      when(jwtTokenService_getRefreshToken)
        .calledWith(existingUser.id, aud)
        .mockResolvedValue(refreshToken as never);
      when(compareSpy)
        .calledWith(password, 'hashed-password')
        .mockResolvedValue(true as never);

      // When
      const result = await service.loginUser(email, password, aud);

      // Then
      expect(result).toEqual({ tokens: { accessToken, refreshToken }, user: existingUser.toJSON() });
      expect(cacheManager_set).toHaveBeenCalledWith(existingUser.id, {
        userId: existingUser.id,
        activeAccessToken: accessToken,
        activeRefreshToken: refreshToken,
        oldAccessTokens: [],
        oldRefreshTokens: [],
      });
    });

    it('should throw BadRequestException if password comparison fails', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'wrong-password';
      const aud: Audience = Audience.ADMIN_APP;
      const existingUser = { id: 'user-id', email, toJSON: jest.fn() };
      const credentials = {
        strategies: [{ type: AuthType.EMAIL_PASSWORD, password: 'hashed-password' }],
      } as Credentials;

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      const service_getCredentials = jest.spyOn(service, 'getCredentials');
      const compareSpy = jest.spyOn(bcrypt, 'compare');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(existingUser as never);
      when(service_getCredentials)
        .calledWith(existingUser.id)
        .mockResolvedValue(credentials as never);
      when(compareSpy)
        .calledWith(password, 'hashed-password')
        .mockResolvedValue(false as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.loginUser(email, password, aud);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', 'Invalid credentials');
    });

    it('should throw BadRequestException if no valid strategy', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'wrong-password';
      const aud: Audience = Audience.ADMIN_APP;
      const existingUser = { id: 'user-id', email, toJSON: jest.fn() };
      const credentials = {
        strategies: [{ type: AuthType.GOOGLE_OAUTH }],
      } as Credentials;

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      const service_getCredentials = jest.spyOn(service, 'getCredentials');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(existingUser as never);
      when(service_getCredentials)
        .calledWith(existingUser.id)
        .mockResolvedValue(credentials as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.loginUser(email, password, aud);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if getUserByEmail fails', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'password';
      const aud: Audience = Audience.ADMIN_APP;
      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      when(usersService_getUserByEmail).calledWith(email).mockRejectedValue(new Error('User not found'));

      // When
      let error: Error | undefined = undefined;
      try {
        await service.loginUser(email, password, aud);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('getCredentials', () => {
    it('should return credentials for a valid user ID', async () => {
      // Given
      const userId = 'valid-user-id';
      const credentials = { userId, strategies: [] } as any;

      const credentialModel_findOne = jest.spyOn(credentialModel, 'findOne');
      when(credentialModel_findOne)
        .calledWith({ userId })
        .mockResolvedValue(credentials as never);

      // When
      const result = await service.getCredentials(userId);

      // Then
      expect(result).toBe(credentials);
    });

    it('should throw BadRequestException if no credentials are found for the given user ID', async () => {
      // Given
      const userId = 'invalid-user-id';

      const credentialModel_findOne = jest.spyOn(credentialModel, 'findOne');
      when(credentialModel_findOne)
        .calledWith({ userId })
        .mockResolvedValue(null as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.getCredentials(userId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });

  describe('registerOAuthUser', () => {
    it('should return tokens and user details for a successful OAuth login', async () => {
      // Given
      const email = 'user@example.com';
      const type = AuthType.GOOGLE_OAUTH;
      const existingUser = {
        id: 'user-id',
        email,
        toJSON: jest.fn().mockReturnValue({ id: 'user-id', email }),
      } as any;
      const existingCredentials = { strategies: [{ type: AuthType.GOOGLE_OAUTH }] } as Credentials;
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      const service_getCredentials = jest.spyOn(service, 'getCredentials');
      const jwtTokenService_getAccessToken = jest.spyOn(jwtTokenService, 'getAccessToken');
      const jwtTokenService_getRefreshToken = jest.spyOn(jwtTokenService, 'getRefreshToken');
      const cache_set = jest.spyOn(cache, 'set');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(existingUser as never);
      when(service_getCredentials)
        .calledWith(existingUser.id)
        .mockResolvedValue(existingCredentials as never);
      when(jwtTokenService_getAccessToken).calledWith(existingUser.id, Audience.WEB_APP).mockResolvedValue(accessToken);
      when(jwtTokenService_getRefreshToken)
        .calledWith(existingUser.id, Audience.WEB_APP)
        .mockResolvedValue(refreshToken);

      // When
      const result = await service.loginUserWithOAuth(email, type);

      // Then
      expect(result).toEqual({
        tokens: { accessToken, refreshToken },
        user: { id: 'user-id', email },
      });
      expect(cache_set).toHaveBeenCalledWith(existingUser.id, expect.any(Object));
    });

    it('should throw BadRequestException if user is not found during OAuth login', async () => {
      // Given
      const email = 'nonexistent@example.com';
      const type = AuthType.GOOGLE_OAUTH;

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(null as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.loginUserWithOAuth(email, type);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', ErrorMessage.INVALID_CREDENTIALS);
    });

    it('should throw BadRequestException if credentials are not found during OAuth login', async () => {
      // Given
      const email = 'user@example.com';
      const type = AuthType.GOOGLE_OAUTH;
      const existingUser = { id: 'user-id', email };

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      const service_getCredentials = jest.spyOn(service, 'getCredentials');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(existingUser as never);
      when(service_getCredentials)
        .calledWith(existingUser.id)
        .mockResolvedValue(null as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.loginUserWithOAuth(email, type);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', ErrorMessage.INVALID_CREDENTIALS);
    });

    it('should throw BadRequestException if auth details are missing during OAuth login', async () => {
      // Given
      const email = 'user@example.com';
      const type = AuthType.GOOGLE_OAUTH;
      const existingUser = { id: 'user-id', email };
      const existingCredentials = { strategies: [] };

      const usersService_getUserByEmail = jest.spyOn(usersService, 'getUserByEmail');
      const service_getCredentials = jest.spyOn(service, 'getCredentials');

      when(usersService_getUserByEmail)
        .calledWith(email)
        .mockResolvedValue(existingUser as never);
      when(service_getCredentials)
        .calledWith(existingUser.id)
        .mockResolvedValue(existingCredentials as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.loginUserWithOAuth(email, type);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });

  describe('registerUser', () => {
    it('should create a new user and credentials for a successful registration', async () => {
      // Given
      const userDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'Password123',
        firstName: 'first',
        lastName: 'last',
      };
      const createdUser = {
        ...userDto,
        id: 'user-id',
        save: jest.fn().mockReturnThis(),
      };
      const existingUser = null;

      const userModel_findOne = jest.spyOn(userModel, 'findOne');
      const userModel_create = jest.spyOn(userModel, 'create');
      const sendRegistrationMail = jest.spyOn(service, 'sendRegistrationMail');

      when(userModel_findOne)
        .calledWith({ email: userDto.email })
        .mockResolvedValue(existingUser as never);
      when(userModel_create)
        .calledWith(userDto)
        .mockResolvedValue(createdUser as any);

      // When
      const result = await service.registerUser(userDto);

      // Then
      expect(result).toEqual(createdUser);
      expect(sendRegistrationMail).toHaveBeenCalledWith(userDto.email);
    });

    it('should throw BadRequestException if the user already exists', async () => {
      // Given
      const userDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'Password123',
        firstName: 'first',
        lastName: 'last',
      };
      const existingUser = { id: 'user-id', email: userDto.email };

      const userModel_findOne = jest.spyOn(userModel, 'findOne');

      when(userModel_findOne)
        .calledWith({ email: userDto.email })
        .mockResolvedValue(existingUser as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.registerUser(userDto);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', ErrorMessage.USER_ALREADY_EXISTS);
    });
  });

  describe('registerOAuthUser', () => {
    it('should create a new user with OAuth credentials for a successful registration', async () => {
      // Given
      const userDto: Partial<CreateUserDto> = {
        email: 'oauthuser@example.com',
        // ...other properties
      };
      const createdUser = {
        ...userDto,
        id: 'user-id',
        save: jest.fn().mockReturnThis(),
      };
      const authType: AuthType = AuthType.GOOGLE_OAUTH;
      const existingUser = null;

      const userModel_findOne = jest.spyOn(userModel, 'findOne');
      const userModel_create = jest.spyOn(userModel, 'create');

      when(userModel_findOne)
        .calledWith({ email: userDto.email })
        .mockResolvedValue(existingUser as never);
      when(userModel_create)
        .calledWith(userDto)
        .mockResolvedValue(createdUser as any);

      // When
      const result = await service.registerOAuthUser(userDto, authType);

      // Then
      expect(result).toEqual(createdUser);
    });

    it('should throw BadRequestException if the user already exists with OAuth registration', async () => {
      // Given
      const userDto: Partial<CreateUserDto> = {
        email: 'oauthuser@example.com',
        // ...other properties
      };
      const authType: AuthType = AuthType.GOOGLE_OAUTH;
      const existingUser = { id: 'user-id', email: userDto.email };

      const userModel_findOne = jest.spyOn(userModel, 'findOne');

      when(userModel_findOne)
        .calledWith({ email: userDto.email })
        .mockResolvedValue(existingUser as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.registerOAuthUser(userDto, authType);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', ErrorMessage.USER_ALREADY_EXISTS);
    });
  });

  describe('authorizeUser', () => {
    it('should authorize a user and set auth details to active', async () => {
      // Given
      const tokenCode = 'valid-token-code';
      const email = 'user@example.com';
      const existingUser = { id: 'user-id', email: email, toJSON: jest.fn().mockReturnValue({ email }) };
      const existingCredentials = { id: 'cred-id', save: jest.fn() };
      const authDetails = { isActive: false };

      jest.spyOn(tokenService, 'claimToken').mockResolvedValue({ email } as any);
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(existingUser as any);
      jest.spyOn(credentialModel, 'findOne').mockResolvedValue(existingCredentials);
      jest.spyOn(service, 'findAuthDetails' as any).mockReturnValue(authDetails);

      // When
      const result = await service.authorizeUser(tokenCode);

      // Then
      expect(result).toEqual(existingUser.toJSON());
      expect(authDetails.isActive).toBe(true);
      expect(existingCredentials.save).toHaveBeenCalled();
    });
  });

  describe('forgotUserPassword', () => {
    it('should send forgot password email if user exists', async () => {
      // Given
      const email = 'user@example.com';
      const existingUser = { firstName: 'John' };
      const token = { code: 'reset-token' };

      const userModel_findOne = jest.spyOn(userModel, 'findOne').mockResolvedValue(existingUser);
      const tokenService_revokeAllActiveResetPasswordTokens = jest
        .spyOn(tokenService, 'revokeAllActiveResetPasswordTokens')
        .mockResolvedValue(undefined);
      const tokenService_createResetPasswordToken = jest
        .spyOn(tokenService, 'createResetPasswordToken')
        .mockResolvedValue(token as any);
      const emailService_sendMail = jest.spyOn(emailService, 'sendMail');

      // When
      await service.forgotUserPassword(email);

      // Then
      expect(userModel_findOne).toHaveBeenCalledWith({ email });
      expect(tokenService_revokeAllActiveResetPasswordTokens).toHaveBeenCalledWith(email);
      expect(tokenService_createResetPasswordToken).toHaveBeenCalledWith(email);
      expect(emailService_sendMail).toHaveBeenCalledWith(email, TokenPurpose.RESET_PASSWORD, {
        token: token.code,
        firstName: existingUser.firstName,
        link: 'http://localhost:3000/reset-password',
      });
    });

    it('should not send email if user does not exist', async () => {
      // Given
      const email = 'nonexistent@example.com';
      const userModel_findOne = jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      // When
      await service.forgotUserPassword(email);

      // Then
      expect(userModel_findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('resetUserPassword', () => {
    it('should reset the user password successfully', async () => {
      // Given
      const password = 'NewPassword123';
      const tokenCode = 'valid-reset-token';
      const email = 'user@example.com';
      const existingUser = { id: 'user-id', email: email, toJSON: jest.fn().mockReturnValue({ email }) };
      const existingCredentials = { id: 'cred-id', save: jest.fn() };
      const authDetails = { password: 'old-password' };

      jest.spyOn(tokenService, 'claimToken').mockResolvedValue({ email } as any);
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(existingUser as any);
      jest.spyOn(credentialModel, 'findOne').mockResolvedValue(existingCredentials);
      jest.spyOn(service, 'findAuthDetails' as any).mockReturnValue(authDetails as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(password as never);

      const cacheManager_del = jest.spyOn(cache, 'del').mockResolvedValue(undefined);

      // When
      const result = await service.resetUserPassword(password, tokenCode);

      // Then
      expect(result).toEqual(existingUser.toJSON());
      expect(authDetails.password).toEqual(password);
      expect(existingCredentials.save).toHaveBeenCalled();
      expect(cacheManager_del).toHaveBeenCalledWith(existingUser.id);
    });
  });

  describe('changeUserPassword', () => {
    it('should change the user password successfully', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'NewPassword123';
      const oldPassword = 'OldPassword123';
      const existingUser = { id: 'user-id', email: email, save: jest.fn() };
      const existingCredentials = { id: 'cred-id', save: jest.fn() };
      const authDetails = { password: 'HashedPassword' };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(existingUser as any);
      jest.spyOn(credentialModel, 'findOne').mockResolvedValue(existingCredentials);
      jest.spyOn(service, 'findAuthDetails' as any).mockReturnValue(authDetails);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(password as never);

      const cacheManager_del = jest.spyOn(cache, 'del').mockResolvedValue(undefined);

      // When
      await service.changeUserPassword(email, password, oldPassword);

      // Then
      expect(authDetails.password).toEqual(password);
      expect(existingCredentials.save).toHaveBeenCalled();
      expect(existingUser.save).toHaveBeenCalled();
      expect(cacheManager_del).toHaveBeenCalledWith(existingUser.id);
    });

    it('should throw BadRequestException if the old password does not match', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'NewPassword123';
      const oldPassword = 'IncorrectOldPassword';
      const existingUser = { id: 'user-id', email: email };
      const existingCredentials = { id: 'cred-id' };
      const authDetails = { password: 'HashedPassword' };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(existingUser as any);
      jest.spyOn(credentialModel, 'findOne').mockResolvedValue(existingCredentials);
      jest.spyOn(service, 'findAuthDetails' as any).mockReturnValue(authDetails);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.changeUserPassword(email, password, oldPassword);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error).toHaveProperty('message', ErrorMessage.INVALID_CREDENTIALS);
    });
  });
});
