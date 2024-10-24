import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, ForbiddenException, HttpException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { when } from 'jest-when';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard Test suite', () => {
  let guard: AuthGuard;
  let jwtTokenService: JwtTokenService;
  let usersService: UsersService;
  let cacheManager: Cache;
  let context: ExecutionContext;

  beforeEach(() => {
    jwtTokenService = createMock<JwtTokenService>();
    usersService = createMock<UsersService>();
    cacheManager = createMock<Cache>();
    context = createMock<ExecutionContext>();
    guard = new AuthGuard(jwtTokenService, usersService, cacheManager);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no token is present', async () => {
      // Given
      const request = { headers: {} };
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue(request);

      // When
      const result = await guard.canActivate(context);

      // Then
      expect(result).toBe(true);
    });

    it('should return true if the token is valid and user is authenticated', async () => {
      // Given
      const token = 'valid-token';
      const request = { headers: { authorization: `Bearer ${token}` } } as any;
      const id = 'user-id';
      const tokenFamily = { activeAccessToken: token };
      const user = { toJSON: () => ({ id, name: 'John Doe' }) };

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue(request);

      // Spies
      const jwtVerifySpy = jest.spyOn(jwtTokenService, 'verifyAccessToken');
      when(jwtVerifySpy)
        .expectCalledWith(token)
        .mockResolvedValue(id as never);

      const cacheGetSpy = jest.spyOn(cacheManager, 'get');
      when(cacheGetSpy)
        .expectCalledWith(id)
        .mockResolvedValue(tokenFamily as never);

      const usersServiceSpy = jest.spyOn(usersService, 'getUser');
      when(usersServiceSpy)
        .expectCalledWith(id)
        .mockResolvedValue(user as never);

      // When
      const result = await guard.canActivate(context);

      // Then
      expect(result).toBe(true);
      expect(request['user']).toEqual(user.toJSON());
    });

    it('should return true even if token family is not found but should not attach user', async () => {
      // Given
      const token = 'valid-token';
      const request = { headers: { authorization: `Bearer ${token}` } } as any;
      const id = 'user-id';

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue(request);

      // Spies
      const jwtVerifySpy = jest.spyOn(jwtTokenService, 'verifyAccessToken');
      when(jwtVerifySpy)
        .expectCalledWith(token)
        .mockResolvedValue(id as never);

      const cacheGetSpy = jest.spyOn(cacheManager, 'get');
      when(cacheGetSpy)
        .expectCalledWith(id)
        .mockResolvedValue(undefined as never);

      // When
      const result = await guard.canActivate(context);

      // Then
      expect(result).toBe(true);
      expect(request['user']).toBeFalsy();
    });

    it('should return true even if token is old but should not attach user', async () => {
      // Given
      const token = 'old-token';
      const request = { headers: { authorization: `Bearer ${token}` } } as any;
      const id = 'user-id';
      const tokenFamily = { activeAccessToken: 'new-token' };

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue(request);

      // Spies
      const jwtVerifySpy = jest.spyOn(jwtTokenService, 'verifyAccessToken');
      when(jwtVerifySpy)
        .expectCalledWith(token)
        .mockResolvedValue(id as never);

      const cacheGetSpy = jest.spyOn(cacheManager, 'get');
      when(cacheGetSpy)
        .expectCalledWith(id)
        .mockResolvedValue(tokenFamily as never);

      const cacheDelSpy = jest.spyOn(cacheManager, 'del').mockResolvedValue(undefined as never);

      const result = await guard.canActivate(context);

      // Then
      expect(result).toBe(true);
      expect(request['user']).toBeFalsy();
    });
  });
});
