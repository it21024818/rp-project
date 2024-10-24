import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { when } from 'jest-when';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentsService } from './payments.service';
import { PaymentStrategyKey } from './paymeny-stategy-key.enum';

describe('Payments Test suite', () => {
  let service: PaymentsService;
  let mockPaymentStrategy: PaymentStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    mockPaymentStrategy = {
      createCheckoutSession: jest.fn(),
      createPortalSession: jest.fn(),
      handleEvent: jest.fn(),
      onModuleInit: jest.fn(),
    } as PaymentStrategy;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStrategy', () => {
    it('should return the correct strategy when it exists', () => {
      // Given
      const key: PaymentStrategyKey = 'valid-key' as PaymentStrategyKey;
      service.register(key, mockPaymentStrategy);

      // When
      const strategy = service.getStrategy(key);

      // Then
      expect(strategy).toBe(mockPaymentStrategy);
    });

    it('should throw BadRequestException if the strategy does not exist', () => {
      // Given
      const key: PaymentStrategyKey = 'non-existent-key' as PaymentStrategyKey;

      // When
      let error: BadRequestException | undefined = undefined;
      try {
        service.getStrategy(key);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.PAYMENT_STRATEGY_NOT_FOUND);
    });
  });

  describe('register', () => {
    it('should register a new payment strategy', () => {
      // Given
      const key: PaymentStrategyKey = 'new-strategy' as PaymentStrategyKey;

      const registerSpy = jest.spyOn(service, 'register');

      // When
      service.register(key, mockPaymentStrategy);

      // Then
      expect(registerSpy).toBeCalledTimes(1);
      expect(service.getStrategy(key)).toBe(mockPaymentStrategy);
    });
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session for a valid strategy', async () => {
      // Given
      const key: PaymentStrategyKey = 'valid-key' as PaymentStrategyKey;
      const planId = 'some-plan-id';
      const userId = 'some-user-id';
      const sessionId = 'session-id';

      const strategySpy = jest.spyOn(mockPaymentStrategy, 'createCheckoutSession');
      when(strategySpy)
        .expectCalledWith(planId, userId)
        .mockResolvedValue(sessionId as never);

      service.register(key, mockPaymentStrategy);

      // When
      const result = await service.createCheckoutSession(key, planId, userId);

      // Then
      expect(result).toBe(sessionId);
      expect(strategySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPortalSession', () => {
    it('should create a portal session for a valid strategy', async () => {
      // Given
      const key: PaymentStrategyKey = 'valid-key' as PaymentStrategyKey;
      const sessionId = 'session-id';
      const portalSessionId = 'portal-session-id';

      const strategySpy = jest.spyOn(mockPaymentStrategy, 'createPortalSession');
      when(strategySpy)
        .expectCalledWith(sessionId)
        .mockResolvedValue(portalSessionId as never);

      service.register(key, mockPaymentStrategy);

      // When
      const result = await service.createPortalSession(key, sessionId);

      // Then
      expect(result).toBe(portalSessionId);
      expect(strategySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleEvent', () => {
    it('should handle an event with a valid strategy', async () => {
      // Given
      const key: PaymentStrategyKey = 'valid-key' as PaymentStrategyKey;
      const request = {} as Request;

      const strategySpy = jest.spyOn(mockPaymentStrategy, 'handleEvent');
      when(strategySpy)
        .expectCalledWith(request)
        .mockResolvedValue(undefined as never);

      service.register(key, mockPaymentStrategy);

      // When
      await service.handleEvent(key, request);

      // Then
      expect(strategySpy).toHaveBeenCalledTimes(1);
    });
  });
});
