import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { EmailService } from '../email/email.service';
import { JwtTokenService } from '../auth/jwt-token.service';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { BadRequestException } from '@nestjs/common';
import ErrorMessage from '../common/enums/error-message.enum';
import { LoginDto } from '../common/dtos/login.dto';
import { CreateUserDto } from '../common/dtos/create-user.dto';
import { UserRole } from '../common/enums/user-roles.enum';
import { TokenPurpose } from '../common/enums/token-purpose.enum';
const bcrypt = require('bcryptjs');

jest.mock('../users/users.service');
jest.mock('../token/token.service');
jest.mock('../email/email.service');

const mockUserService = {
  getUserByEmail: jest.fn(),
};

const mockTokenService = {
  createSignUpToken: jest.fn(),
  revokeAllActiveSignUpTokens: jest.fn(),
  claimToken: jest.fn(),
  createResetPasswordToken: jest.fn(),
  revokeAllActiveResetPasswordTokens: jest.fn(),
};

const mockEmailService = {
  sendMail: jest.fn(),
};

const mockJwtTokenService = {
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
};

const mockUserModel = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let tokenService: TokenService;
  let emailService: EmailService;
  let jwtTokenService: JwtTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: JwtTokenService, useValue: mockJwtTokenService },
        { provide: User.name, useValue: mockUserModel },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
    emailService = module.get<EmailService>(EmailService);
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('loginUser', () => {
    it('should login a user with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const existingUser = { id: '1', password: 'hashedPassword' };
      const mockCompare = jest.fn().mockReturnValue(true);

      jest.spyOn(bcrypt, 'compare').mockImplementation(mockCompare);
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      mockJwtTokenService.getAccessToken.mockReturnValue(accessToken);
      mockJwtTokenService.getRefreshToken.mockReturnValue(refreshToken);

      const result = await authService.loginUser(email, password);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(mockCompare).toHaveBeenCalledWith(password, 'hashedPassword');
      expect(mockJwtTokenService.getAccessToken).toHaveBeenCalledWith(
        existingUser.id,
      );
      expect(mockJwtTokenService.getRefreshToken).toHaveBeenCalledWith(
        existingUser.id,
      );
      expect(result).toEqual({
        tokens: { accessToken, refreshToken },
        user: expect.any(Object),
      });
    });

    it('should throw an error if user not found', async () => {
      const email = 'unknown@example.com';

      await expect(authService.loginUser(email, 'password')).rejects.toThrow(
        new BadRequestException(ErrorMessage.INVALID_CREDENTIALS),
      );
    });
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userDto: CreateUserDto = {
        firstName: 'john',
        lastName: 'calos',
        country: 'sri lanka',
        region: 'colombo',
        email: 'test@example.com',
        password: 'password',
      };
      const mockHash = jest.fn().mockReturnValue('hashedPassword');
      jest.spyOn(bcrypt, 'hash').mockImplementation(mockHash);
      mockUserModel.save.mockReturnValue(userDto);

      const result = await authService.registerUser(userDto);

      expect(mockHash).toHaveBeenCalledWith(userDto.password, 10);
      expect(mockUserModel.save).toHaveBeenCalledWith(
        expect.objectContaining(userDto),
      );
      expect(result).toEqual(userDto);
    });

    it('should throw an error if user already exists', async () => {
      const userDto: CreateUserDto = {
        firstName: 'john',
        lastName: 'calos',
        country: 'sri lanka',
        region: 'colombo',
        email: 'test@example.com',
        password: 'password',
      };
      mockUserModel.findOne.mockReturnValue({ email: userDto.email });

      await expect(authService.registerUser(userDto)).rejects.toThrow(
        new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS),
      );
    });
  });

  describe('sendRegistrationMail', () => {
    it('should send a registration email', async () => {
      const email = 'test@example.com';
      mockTokenService.revokeAllActiveSignUpTokens.mockReturnValue(undefined);
      await authService.sendRegistrationMail(email);

      expect(mockTokenService.revokeAllActiveSignUpTokens).toHaveBeenCalledWith(
        email,
      );
      expect(tokenService.createSignUpToken).toHaveBeenCalledWith(email);
      expect(emailService.sendMail).toHaveBeenCalledWith(
        email,
        TokenPurpose.SIGN_UP,
        { token: 'token-code' },
      );
    });
  });

  describe('authorizeUser', () => {
    it('should authorize a user', async () => {
      const tokenCode = 'token-code';
      const email = 'test@example.com';
      const existingUser = { email, isAuthorized: false };
      mockTokenService.claimToken.mockReturnValue({ email });
      mockUserModel.findOne.mockReturnValue(existingUser);
      mockUserModel.save.mockReturnValue(existingUser);

      const result = await authService.authorizeUser(tokenCode);

      expect(mockTokenService.claimToken).toHaveBeenCalledWith(
        tokenCode,
        TokenPurpose.SIGN_UP,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockUserModel.save).toHaveBeenCalledWith(existingUser);
      expect(result).toEqual(
        expect.objectContaining({ email, isAuthorized: true }),
      );
    });

    it('should throw an error if user not found', async () => {
      const tokenCode = 'token-code';
      mockTokenService.claimToken.mockReturnValue({
        email: 'unknown@example.com',
      });
      mockUserModel.findOne.mockReturnValue(null);

      await expect(authService.authorizeUser(tokenCode)).rejects.toThrow(
        new BadRequestException(ErrorMessage.USER_NOT_FOUND),
      );
    });
  });

  describe('forgotUserPassword', () => {
    it('should send a forgot password email', async () => {
      const email = 'test@example.com';
      const existingUser = { email };
      mockUserModel.findOne.mockReturnValue(existingUser);
      mockTokenService.revokeAllActiveResetPasswordTokens.mockReturnValue(
        undefined,
      );

      await authService.forgotUserPassword(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(
        mockTokenService.revokeAllActiveResetPasswordTokens,
      ).toHaveBeenCalledWith(email);
      expect(tokenService.createResetPasswordToken).toHaveBeenCalledWith(email);
      expect(emailService.sendMail).toHaveBeenCalledWith(
        email,
        TokenPurpose.RESET_PASSWORD,
        { token: 'token-code' },
      );
    });

    it('should not send an email if user not found', async () => {
      const email = 'unknown@example.com';
      mockUserModel.findOne.mockReturnValue(null);

      await expect(
        authService.forgotUserPassword(email),
      ).resolves.not.toThrow();
      expect(emailService.sendMail).not.toHaveBeenCalled();
    });
  });

  describe('resetUserPassword', () => {
    it('should reset a user password', async () => {
      const password = 'newPassword';
      const tokenCode = 'token-code';
      const email = 'test@example.com';
      const mockHash = jest.fn().mockReturnValue('hashedPassword');
      jest.spyOn(bcrypt, 'hash').mockImplementation(mockHash);
      const existingUser = { email };
      mockTokenService.claimToken.mockReturnValue({ email });
      mockUserModel.findOne.mockReturnValue(existingUser);
      mockUserModel.save.mockReturnValue(existingUser);

      await authService.resetUserPassword(password, tokenCode);

      expect(mockTokenService.claimToken).toHaveBeenCalledWith(
        tokenCode,
        TokenPurpose.RESET_PASSWORD,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockHash).toHaveBeenCalledWith(password, 10);
      expect(mockUserModel.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashedPassword' }),
      );
    });

    it('should throw an error if user not found', async () => {
      const password = 'newPassword';
      const tokenCode = 'token-code';
      mockTokenService.claimToken.mockReturnValue({
        email: 'unknown@example.com',
      });
      mockUserModel.findOne.mockReturnValue(null);

      await expect(
        authService.resetUserPassword(password, tokenCode),
      ).rejects.toThrow(new BadRequestException(ErrorMessage.USER_NOT_FOUND));
    });
  });

  describe('changeUserPassword', () => {
    it('should change a user password with valid old password', async () => {
      const email = 'test@example.com';
      const password = 'newPassword';
      const oldPassword = 'oldPassword';
      const existingUser = { email, password: 'hashedOldPassword' };
      const mockCompare = jest.fn().mockReturnValue(true);
      const mockHash = jest.fn().mockReturnValue('hashedNewPassword');
      jest.spyOn(bcrypt, 'compare').mockImplementation(mockCompare);
      jest.spyOn(bcrypt, 'hash').mockImplementation(mockHash);
      mockUserModel.findOne.mockReturnValue(existingUser);
      mockUserModel.save.mockReturnValue(existingUser);

      await authService.changeUserPassword(email, password, oldPassword);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockCompare).toHaveBeenCalledWith(
        oldPassword,
        'hashedOldPassword',
      );
      expect(mockHash).toHaveBeenCalledWith(password, 10);
      expect(mockUserModel.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashedNewPassword' }),
      );
    });

    it('should throw an error for invalid old password', async () => {
      const email = 'test@example.com';
      const password = 'newPassword';
      const oldPassword = 'wrongPassword';
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false);

      await expect(
        authService.changeUserPassword(email, password, oldPassword),
      ).rejects.toThrow(
        new BadRequestException(ErrorMessage.INVALID_CREDENTIALS),
      );
    });

    it('should not throw an error if user not found', async () => {
      const email = 'unknown@example.com';
      const password = 'newPassword';
      const oldPassword = 'oldPassword';
      mockUserModel.findOne.mockReturnValue(null);

      await expect(
        authService.changeUserPassword(email, password, oldPassword),
      ).resolves.not.toThrow();
    });
  });
});
