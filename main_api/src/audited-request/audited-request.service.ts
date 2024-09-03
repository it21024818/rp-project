import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import DeviceDetector from 'node-device-detector';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import { Audience } from 'src/common/enums/audience.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { CoreService } from 'src/core/core.service';
import { AuditedRequest } from './audited-request.schema';

@Injectable()
export class AuditedRequestService {
  private readonly logger = new Logger(AuditedRequestService.name);
  private readonly detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: false,
    maxUserAgentSize: 500,
  });

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly coreService: CoreService,
    @InjectModel(AuditedRequest.name) private readonly auditedRequestModel: Model<AuditedRequest>,
  ) {}

  async createAuditedRequest(request: Request, _response: Response) {
    const userAgent = request.headers['user-agent'];
    const authorization = request.headers['authorization'];
    if (!userAgent) {
      this.logger.warn(`Could not save request details as user-agent was falsey '${userAgent}'`);
      return;
    }

    const detectionResult = this.detector.detect(userAgent);

    let audience = '';
    // if (authorization) {
    //   const token = authorization.split(' ')[1];
    //   const payload = await this.jwtTokenService.getPayload(token);
    //   if (payload.sub) {
    //     audience = payload.sub;
    //   }
    // }
    return await new this.auditedRequestModel({
      createdAt: new Date(),
      audience,
      endpoint: request.baseUrl + request.path,
      origin: detectionResult,
    }).save();
  }

  async getAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'web' | 'mobile' | 'extension'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.auditedRequestModel,
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
  }
}
