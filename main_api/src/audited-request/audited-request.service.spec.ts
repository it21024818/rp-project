import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { Audience } from 'src/common/enums/audience.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { CoreService } from 'src/core/core.service';
import { AuditedRequest } from './audited-request.schema';
import { AuditedRequestService } from './audited-request.service';

describe('AuditedRequests Test suite', () => {
  let service: AuditedRequestService;
  let jwtTokenService: JwtTokenService;
  let coreService: CoreService;
  let auditedRequestModel: Model<AuditedRequest>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuditedRequestService,
        { provide: JwtTokenService, useValue: createMock<JwtTokenService>() },
        { provide: CoreService, useValue: createMock<CoreService>() },
        { provide: getModelToken(AuditedRequest.name), useValue: createMock<Model<AuditedRequest>>() },
      ],
    }).compile();

    service = module.get<AuditedRequestService>(AuditedRequestService);
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
    coreService = module.get<CoreService>(CoreService);
    auditedRequestModel = module.get<Model<AuditedRequest>>(getModelToken(AuditedRequest.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAuditedRequest', () => {
    it('should save the audited request when user agent and authorization are provided', async () => {
      // Given
      const request = {
        headers: { 'user-agent': 'Mozilla/5.0', authorization: 'Bearer valid-token' },
        baseUrl: '/api',
        path: '/endpoint',
      } as Request;
      const detectionResult = { client: {}, device: {} };
      const payload = { aud: 'some-audience' };
      const savedRequest = { save: jest.fn().mockResolvedValue({}) };

      // Mocking methods
      const detect = jest.spyOn(service['detector'], 'detect').mockReturnValue(detectionResult as any);
      const getPayload = jest.spyOn(jwtTokenService, 'getPayload').mockResolvedValue(payload as any);
      const createAuditedRequest = jest.spyOn(auditedRequestModel, 'create').mockReturnValue(savedRequest as any);

      // When
      await service.createAuditedRequest(request, {} as Response);

      // Then
      expect(detect).toHaveBeenCalledWith(request.headers['user-agent']);
      expect(getPayload).toHaveBeenCalledWith('valid-token');
      expect(createAuditedRequest).toHaveBeenCalledWith({
        createdAt: expect.any(Date),
        audience: payload.aud,
        endpoint: '/api/endpoint',
        origin: detectionResult,
      });
    });

    it('should not save the audited request if user agent is falsy', async () => {
      // Given
      const request = { headers: {}, baseUrl: '/api', path: '/endpoint' } as Request;

      // When
      await service.createAuditedRequest(request, {} as Response);

      // Then
      expect(jwtTokenService.getPayload).not.toHaveBeenCalled();
      expect(auditedRequestModel.create).not.toHaveBeenCalled();
    });

    it('should handle error when getting payload fails', async () => {
      // Given
      const request = {
        headers: { 'user-agent': 'Mozilla/5.0', authorization: 'Bearer valid-token' },
        baseUrl: '/api',
        path: '/endpoint',
      } as Request;
      const detectionResult = { client: {}, device: {} };

      jest.spyOn(service['detector'], 'detect').mockReturnValue(detectionResult as any);
      jest.spyOn(jwtTokenService, 'getPayload').mockRejectedValue(new Error('Invalid token'));

      // When
      await service.createAuditedRequest(request, {} as Response);

      // Then
      expect(jwtTokenService.getPayload).toHaveBeenCalled();
      expect(auditedRequestModel.create).not.toHaveBeenCalled();
    });
  });

  describe('getAnalytics', () => {
    it('should return time-based analytics', async () => {
      // Given
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const frequency = Frequency.DAILY;
      const analyticsResult = { web: [], mobile: [], extension: [] };

      jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics').mockResolvedValue(analyticsResult as any);

      // When
      const result = await service.getAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService.getOptimizedTimeBasedAnalytics).toHaveBeenCalledWith({
        model: auditedRequestModel,
        options: {
          startDate,
          endDate,
          frequency,
        },
        fields: {
          web: { path: 'audience', value: Audience.WEB_APP },
          extension: { path: 'audience', value: Audience.EXTENSION },
          mobile: { path: 'audience', value: Audience.MOBILE_APP },
        },
      });
      expect(result).toEqual(analyticsResult);
    });
  });
});
