import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LogGuard implements CanActivate {
  private logger = new Logger(LogGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    this.logger.log(`Request received to ${request.method} '${request.path}'`);
    return true;
  }
}
