import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { when } from 'jest-when';
import { Model } from 'mongoose';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { Plan } from './plan.schema';
import { StripeStrategy } from './stripe.strategy';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      customers: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
      checkout: {
        sessions: {
          create: jest.fn(),
          retrieve: jest.fn(),
        },
      },
      billingPortal: {
        sessions: {
          create: jest.fn(),
        },
      },
      webhooks: {
        constructEvent: jest.fn(),
      },
    };
  });
});

describe('StripeStrategy Test suite', () => {
  let apiKey: string = 'api-key';
  let strategy: StripeStrategy;
  let paymentsService: PaymentsService;
  let usersService: UsersService;
  let configService: ConfigService;
  let planModel: Model<Plan>;
  let stripe: Stripe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StripeStrategy,
        { provide: PaymentsService, useValue: createMock<PaymentsService>() },
        { provide: ConfigService, useValue: { get: () => apiKey } },
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: getModelToken(Plan.name), useValue: createMock<Model<Plan>>() },
      ],
    }).compile();

    strategy = module.get<StripeStrategy>(StripeStrategy);
    stripe = strategy['stripe'];
    paymentsService = module.get<PaymentsService>(PaymentsService);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
    planModel = module.get<Model<Plan>>(getModelToken(Plan.name));
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session', async () => {
      // 1st part: variable declarations
      const planId = 'plan_test_id';
      const userId = 'user_test_id';
      const mockUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        subscription: null,
        save: jest.fn(),
      };
      const mockPlan = { stripeId: 'stripe_plan_id' };
      const mockCustomer = { id: 'customer_test_id' };
      const mockSession = { url: 'checkout_url' };

      // 2nd part: spies and expected behavior
      const createCustomerSpy = jest.spyOn(stripe.customers, 'create').mockResolvedValue(mockCustomer as any);
      const getUserSpy = jest.spyOn(usersService, 'getUser');
      const getPlanSpy = jest.spyOn(planModel, 'findById');
      const updateUserDocumentSpy = jest.spyOn(usersService, 'updateUserDocument');
      const createSessionSpy = jest.spyOn(stripe.checkout.sessions, 'create').mockResolvedValue(mockSession as any);

      when(getUserSpy)
        .calledWith(userId)
        .mockResolvedValue(mockUser as never);
      when(getPlanSpy)
        .calledWith(planId)
        .mockResolvedValue(mockPlan as never);
      when(updateUserDocumentSpy)
        .calledWith(mockUser as any)
        .mockResolvedValue(mockUser as never);

      // Call the function being tested
      const result = await strategy.createCheckoutSession(planId, userId);

      // Assertions
      expect(createSessionSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockSession.url);
      expect(mockUser.subscription).toEqual({
        STRIPE: {
          customerId: mockCustomer.id,
          status: SubscriptionStatus.PAUSED,
        },
      });
      expect(updateUserDocumentSpy).toHaveBeenCalledTimes(1);
      expect(createCustomerSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if session URL is invalid', async () => {
      // 1st part: variable declarations
      const planId = 'plan_test_id';
      const userId = 'user_test_id';
      const mockUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        subscription: null,
        save: jest.fn(),
      };
      const mockPlan = { stripeId: 'stripe_plan_id' };
      const mockCustomer = { id: 'customer_test_id' };
      const mockSession = { url: null };

      // 2nd part: spies and expected behavior
      const getUserSpy = jest.spyOn(usersService, 'getUser');
      const getPlanSpy = jest.spyOn(planModel, 'findById');
      const createCustomerSpy = jest.spyOn(stripe.customers, 'create').mockResolvedValue(mockCustomer as any);
      const createSessionSpy = jest.spyOn(stripe.checkout.sessions, 'create').mockResolvedValue(mockSession as any);

      when(getUserSpy)
        .calledWith(userId)
        .mockResolvedValue(mockUser as never);
      when(getPlanSpy)
        .calledWith(planId)
        .mockResolvedValue(mockPlan as never);

      // Call the function being tested
      await expect(strategy.createCheckoutSession(planId, userId)).rejects.toThrow(InternalServerErrorException);
      expect(createSessionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPortalSession', () => {
    it('should create a portal session', async () => {
      // 1st part: variable declarations
      const sessionId = 'session_test_id';
      const mockCheckoutSession = { customer: 'customer_test_id' };
      const mockPortalSession = { url: 'portal_url' };

      // 2nd part: spies and expected behavior
      const retrieveCheckoutSessionSpy = jest
        .spyOn(stripe.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockCheckoutSession as any);
      const createPortalSessionSpy = jest
        .spyOn(stripe.billingPortal.sessions, 'create')
        .mockResolvedValue(mockPortalSession as any);

      // Call the function being tested
      const result = await strategy.createPortalSession(sessionId);

      // Assertions
      expect(retrieveCheckoutSessionSpy).toHaveBeenCalledTimes(1);
      expect(createPortalSessionSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockPortalSession.url);
    });

    it('should throw an error if portal session URL is invalid', async () => {
      // 1st part: variable declarations
      const sessionId = 'session_test_id';
      const mockCheckoutSession = { customer: 'customer_test_id' };
      const mockPortalSession = { url: null };

      // 2nd part: spies and expected behavior
      const retrieveCheckoutSessionSpy = jest
        .spyOn(stripe.checkout.sessions, 'retrieve')
        .mockResolvedValue(mockCheckoutSession as any);
      const createPortalSessionSpy = jest
        .spyOn(stripe.billingPortal.sessions, 'create')
        .mockResolvedValue(mockPortalSession as any);

      // Call the function being tested
      await expect(strategy.createPortalSession(sessionId)).rejects.toThrow(InternalServerErrorException);
      expect(retrieveCheckoutSessionSpy).toHaveBeenCalledTimes(1);
      expect(createPortalSessionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleEvent', () => {
    it('should handle a customer subscription created event', async () => {
      // 1st part: variable declarations
      const request = { headers: { 'stripe-signature': 'test_signature' }, rawBody: 'test_raw_body' } as any as Request;
      const user = {
        id: 'test',
        save: jest.fn(),
      };
      const mockEvent = {
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_test_id',
            customer: 'customer_test_id',
            items: { data: [{ price: { id: 'plan_test_id' } }] },
          },
        },
      };

      // 2nd part: spies and expected behavior
      const userService_getUserByStripeCustomerId = jest.spyOn(usersService, 'getUserByStripeCustomerId');
      const constructEventSpy = jest.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(mockEvent as any);

      when(userService_getUserByStripeCustomerId)
        .calledWith(mockEvent.data.object.customer)
        .mockResolvedValue(user as any);

      // Call the function being tested
      await strategy.handleEvent(request);

      // Assertions
      expect(constructEventSpy).toHaveBeenCalledTimes(1);
    });

    it('should skip unhandled event types', async () => {
      // 1st part: variable declarations
      const request = { headers: { 'stripe-signature': 'test_signature' }, rawBody: 'test_raw_body' } as any as Request;
      const mockEvent = { type: 'unhandled.event.type' };

      // 2nd part: spies and expected behavior
      const constructEventSpy = jest.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(mockEvent as any);

      // Call the function being tested
      await strategy.handleEvent(request);

      // Assertions
      expect(constructEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});
