import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import DeviceDetector from 'node-device-detector';
import DeviceHelper from 'node-device-detector/helper';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import { Audience } from 'src/common/enums/audience.enum';
import { Frequency, FrequencyUtil } from 'src/common/enums/frequency.enum';
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
    @InjectModel(AuditedRequest.name) private readonly auditedRequestModel: Model<AuditedRequest>,
  ) {}

  async createAuditedRequest(request: Request, response: Response) {
    const userAgent = request.headers['user-agent'];
    const authorization = request.headers['authorization'];
    if (!userAgent) {
      this.logger.warn(`Could not save request details as user-agent was falsey '${userAgent}'`);
      return;
    }

    const detectionResult = this.detector.detect(userAgent);

    let audience: string = '';
    if (authorization) {
      const token = authorization.split(' ')[1];
      const payload = await this.jwtTokenService.getPayload(token);
      if (payload.sub) {
        audience = payload.sub;
      }
    }
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
    let bins: TimeBasedAnalytics<'web' | 'mobile' | 'extension'>['bins'] = [];
    const items = await this.auditedRequestModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const web = items
        .filter(item => dayjs(item.createdAt).isBefore(next))
        .filter(item => dayjs(item.createdAt).isAfter(current))
        .filter(item => item.audience === Audience.WEB_APP).length;
      const extension = items
        .filter(item => dayjs(item.createdAt).isBefore(next))
        .filter(item => dayjs(item.createdAt).isAfter(current))
        .filter(item => item.audience === Audience.EXTENSION).length;
      const mobile = items
        .filter(item => dayjs(item.createdAt).isBefore(next))
        .filter(item => dayjs(item.createdAt).isAfter(current))
        .filter(item => item.audience === Audience.MOBILE_APP).length;
      bins = [...bins, { startDate: current.toDate(), endDate: next.toDate(), web, extension, mobile }];
      current = next;
    }

    let sum: TimeBasedAnalytics<'web' | 'mobile' | 'extension'>['sum'] = {
      total: 0,
      extension: bins.map(item => item.extension).reduce((a = 0, b = 0) => a + b),
      web: bins.map(item => item.web).reduce((a = 0, b = 0) => a + b),
      mobile: bins.map(item => item.mobile).reduce((a = 0, b = 0) => a + b),
    };
    sum.total = sum.extension + sum.web + sum.mobile;

    return { sum, bins };
  }
}
