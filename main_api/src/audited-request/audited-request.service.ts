import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import DeviceDetector from 'node-device-detector';
import DeviceHelper from 'node-device-detector/helper';
import { AuditedRequest, AuditedRequestModel } from './audited-request.schema';

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

  // constructor(@InjectModel(AuditedRequest.name) private readonly auditedRequestModel: AuditedRequestModel) {}

  async createAuditedRequest(request: Request, response: Response) {
    const userAgent = request.headers['user-agent'];
    const host = request.headers.host;
    if (!userAgent) {
      this.logger.warn(`Could not save request details as user-agent was falsey '${userAgent}'`);
      return;
    }

    const detectionResult = this.detector.detect(userAgent);
    const deviceType = DeviceHelper.getDeviceType(detectionResult);
    // return await new this.auditedRequestModel({
    //   endpoint: request.baseUrl + request.path,
    //   request,
    //   response,
    //   origin: `${host} ${deviceType}`,
    // }).save();
  }
}
