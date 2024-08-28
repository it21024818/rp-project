import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { AuditedRequestService } from './audited-request.service';

@Injectable()
export class AuditedRequestInterceptor implements NestInterceptor {
  constructor(private readonly auditedRequestService: AuditedRequestService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(res => {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      this.auditedRequestService.createAuditedRequest(request, response); // We do not await this. Its a background process.
      return res;
    });
  }
}
