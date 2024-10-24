import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { FlatUser } from 'src/users/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';
import ErrorMessage from '../enums/error-message.enum';
import { UserRole } from '../enums/user-roles.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard Test suite', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = createMock<Reflector>();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      // Given
      const context = createMock<ExecutionContext>();
      const reflectorGetAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride');
      when(reflectorGetAllAndOverride)
        .expectCalledWith(ROLES_KEY, [context.getHandler(), context.getClass()])
        .mockReturnValue(undefined as never);

      // When
      const result = guard.canActivate(context);

      // Then
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when user is not authenticated', () => {
      // Given
      const context = createMock<ExecutionContext>();

      const reflectorGetAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride');
      const context_switchToHttp_getRequest_spy = jest.spyOn(context.switchToHttp(), 'getRequest');

      when(reflectorGetAllAndOverride)
        .expectCalledWith(ROLES_KEY, [context.getHandler(), context.getClass()])
        .mockReturnValue(['ADMIN'] as UserRole[] as never);
      when(context_switchToHttp_getRequest_spy).mockReturnValue({ user: undefined });

      // When
      let error: Error | undefined = undefined;
      try {
        guard.canActivate(context);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error?.message).toBe(ErrorMessage.NOT_AUTHENTICATED);
    });

    it('should throw UnauthorizedException when user has insufficient permissions', () => {
      // Given
      const user: FlatUser = { roles: ['USER'] } as any;
      const context = createMock<ExecutionContext>();

      const context_switchToHttp_getRequest_spy = jest.spyOn(context.switchToHttp(), 'getRequest');
      const reflectorGetAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride');
      when(reflectorGetAllAndOverride)
        .expectCalledWith(ROLES_KEY, [context.getHandler(), context.getClass()])
        .mockReturnValue(['ADMIN'] as UserRole[] as never);
      when(context_switchToHttp_getRequest_spy).mockReturnValue({ user });

      // When
      let error: Error | undefined = undefined;
      try {
        guard.canActivate(context);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error?.message).toBe(ErrorMessage.INSUFFICIENT_PERMISSIONS);
    });

    it('should return true when user has sufficient permissions', () => {
      // Given
      const context = createMock<ExecutionContext>();
      const reflectorGetAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride');
      when(reflectorGetAllAndOverride)
        .expectCalledWith(ROLES_KEY, [context.getHandler(), context.getClass()])
        .mockReturnValue(['ADMIN'] as UserRole[] as never);

      const user: FlatUser = { roles: ['ADMIN'] } as any;
      jest.spyOn(context.switchToHttp().getRequest(), 'user' as never).mockReturnValue(user as never);

      // When
      const result = guard.canActivate(context);

      // Then
      expect(result).toBe(true);
    });
  });
});
