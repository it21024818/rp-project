import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { TokenPurpose } from 'src/common/enums/token-purpose.enum';
import { TokenStatus } from 'src/common/enums/token-status.enum';
import { TokenService } from './token.service';
import { Token } from './token.schema';

describe('TokenService', () => {
  let tokenService: TokenService;
  let tokenModel: Model<Token>;

  beforeEach(() => {
    tokenModel = {} as Model<Token>;
    tokenService = new TokenService(tokenModel);
  });

  describe('createSignUpToken', () => {
    it('should create a sign-up token', async () => {
      const saveSpy = jest.spyOn(tokenModel.prototype, 'save').mockResolvedValueOnce({
        toJSON: jest.fn().mockReturnValue({}),
      } as any);

      await tokenService.createSignUpToken('test@example.com');

      expect(saveSpy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('createResetPasswordToken', () => {
    it('should create a reset password token', async () => {
      const saveSpy = jest.spyOn(tokenModel.prototype, 'save').mockResolvedValueOnce({
        toJSON: jest.fn().mockReturnValue({}),
      } as any);

      await tokenService.createResetPasswordToken('test@example.com');

      expect(saveSpy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('revokeAllActiveSignUpTokens', () => {
    it('should revoke all active sign-up tokens', async () => {
      const findSpy = jest.spyOn(tokenModel, 'find').mockResolvedValueOnce([
        { tokenStatus: TokenStatus.ACTIVE, save: jest.fn() },
      ] as any);

      await tokenService.revokeAllActiveSignUpTokens('test@example.com');

      expect(findSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        purpose: TokenPurpose.SIGN_UP,
        tokenStatus: TokenStatus.ACTIVE,
      });
    });
  });

  describe('revokeAllActiveResetPasswordTokens', () => {
    it('should revoke all active reset password tokens', async () => {
      const findSpy = jest.spyOn(tokenModel, 'find').mockResolvedValueOnce([
        { tokenStatus: TokenStatus.ACTIVE, save: jest.fn() },
      ] as any);

      await tokenService.revokeAllActiveResetPasswordTokens('test@example.com');

      expect(findSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        purpose: TokenPurpose.RESET_PASSWORD,
        tokenStatus: TokenStatus.ACTIVE,
      });
    });
  });

  describe('claimToken', () => {
    it('should claim a token', async () => {
      const findOneSpy = jest.spyOn(tokenModel, 'findOne').mockResolvedValueOnce({
        tokenStatus: TokenStatus.ACTIVE,
        save: jest.fn().mockResolvedValueOnce({ toJSON: jest.fn() }),
      } as any);

      const savedToken = await tokenService.claimToken('test-code', TokenPurpose.RESET_PASSWORD);

      expect(findOneSpy).toHaveBeenCalledWith({
        code: 'test-code',
        purpose: TokenPurpose.RESET_PASSWORD,
      });
      expect(savedToken).toBeDefined();
    });

    it('should throw BadRequestException if token not found', async () => {
      jest.spyOn(tokenModel, 'findOne').mockResolvedValueOnce(null);

      await expect(tokenService.claimToken('nonexistent-code', TokenPurpose.RESET_PASSWORD))
        .rejects.toThrowError(BadRequestException);
    });
  });

});
