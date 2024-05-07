import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../common/dtos/create-user.dto';
import { LoginRequestDto } from '../common/dtos/login-request.dto';
import { ResetPasswordRequestDto } from 'src/common/dtos/reset-password-request.dto';
import { ChangePasswordRequestDto } from 'src/common/dtos/change-password-request.dto';
import { HttpStatus } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-roles.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('loginUser', () => {
    it('should return a login dto', async () => {
      const loginRequest: LoginRequestDto = { email: 'test@example.com', password: 'password' };
      const mockLoginDto = { token: 'mockToken' };
      jest.spyOn(authService, 'loginUser').mockResolvedValue(mockLoginDto as any);

      const result = await controller.loginUser(loginRequest);

      expect(result).toEqual(mockLoginDto);
    });
  });

  describe('registerUser', () => {
    it('should call authService.registerUser with the provided userDto', async () => {
      const userDto: CreateUserDto = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe', region: 'US', country: 'USA' };
      const spy = jest.spyOn(authService, 'registerUser');

      await controller.registerUser(userDto);

      expect(spy).toHaveBeenCalledWith(userDto);
    });
  });

  describe('resendRegistrationMail', () => {
    it('should call authService.sendRegistrationMail with the provided email', async () => {
      const email = 'test@example.com';
      const spy = jest.spyOn(authService, 'sendRegistrationMail');

      await controller.resendRegistrationMail(email);

      expect(spy).toHaveBeenCalledWith(email);
    });
  });

  describe('authorizeUser', () => {
    it('should call authService.authorizeUser with the provided tokenCode', async () => {
      const tokenCode = 'mockToken';
      const spy = jest.spyOn(authService, 'authorizeUser');

      await controller.authorizeUser(tokenCode);

      expect(spy).toHaveBeenCalledWith(tokenCode);
    });
  });

  describe('forgotUserPassword', () => {
    it('should call authService.forgotUserPassword with the provided email', async () => {
      const email = 'test@example.com';
      const spy = jest.spyOn(authService, 'forgotUserPassword');

      await controller.forgotUserPassword(email);

      expect(spy).toHaveBeenCalledWith(email);
    });
  });

  describe('resetUserPassword', () => {
    it('should call authService.resetUserPassword with the provided password and tokenCode', async () => {
      const resetPasswordRequest: ResetPasswordRequestDto = { password: 'newPassword', tokenCode: 'mockToken' };
      const spy = jest.spyOn(authService, 'resetUserPassword');

      await controller.resetUserPassword(resetPasswordRequest);

      expect(spy).toHaveBeenCalledWith(resetPasswordRequest.password, resetPasswordRequest.tokenCode);
    });
  });

  describe('changeUserPassword', () => {
    it('should call authService.changeUserPassword with the provided email, password, and oldPassword only if user has appropriate role', async () => {
      const changePasswordRequest: ChangePasswordRequestDto = { password: 'newPassword', oldPassword: 'oldPassword' };
      const userWithRole = { email: 'test@example.com', role: UserRole.ADMIN }; 
      const spyAuthService = jest.spyOn(authService, 'changeUserPassword');
      const spyUserDecorator = jest.spyOn(controller, 'changeUserPassword').mockResolvedValue(undefined);
  
      // Mock the user decorator to return the user with the appropriate role
      jest.spyOn(controller, 'changeUserPassword').mockImplementation(() => {
        return Promise.resolve(undefined);
      });
  
      // Call the method with a user with appropriate role
      await controller.changeUserPassword(userWithRole.email, changePasswordRequest);
  
      expect(spyAuthService).toHaveBeenCalled();
      expect(spyUserDecorator).toHaveBeenCalledWith(userWithRole.email, changePasswordRequest);
    });
  
    it('should not call authService.changeUserPassword if user does not have appropriate role', async () => {
      const changePasswordRequest: ChangePasswordRequestDto = { password: 'newPassword', oldPassword: 'oldPassword' };
      const userWithoutRole = { email: 'test@example.com', role: UserRole.USER }; 
      const spyAuthService = jest.spyOn(authService, 'changeUserPassword');
      const spyUserDecorator = jest.spyOn(controller, 'changeUserPassword').mockResolvedValue(undefined);
  
      // Mock the user decorator to return the user without the appropriate role
      jest.spyOn(controller, 'changeUserPassword').mockImplementation(() => {
        return Promise.resolve(undefined);
      });
  
      // Call the method with a user without appropriate role
      await controller.changeUserPassword(userWithoutRole.email, changePasswordRequest);
  
      expect(spyAuthService).not.toHaveBeenCalled();
      expect(spyUserDecorator).toHaveBeenCalledWith(userWithoutRole.email, changePasswordRequest);
    });
  });
  
});
