import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenService } from 'src/auth/jwt-token.service'
import { UsersService } from 'src/users/users.service';
import ErrorMessage from '../enums/error-message.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('Attempting to authenticate user...');
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);
    if (!token) {
      this.logger.debug(`Could not authenticate user as they had no token`);
      return true;
    }
    try {
      const id = await this.jwtTokenService.verifyAccessToken(token);
      const user = await this.usersService.getUser(id);
      const userJson = user.toJSON();
      this.logger.debug(`Authenticated user with id '${id}'`);
      request['user'] = userJson;
    } catch {
      this.logger.debug(`Could not authenticate user as they had an invalid token`);
    }
    return true;
  }

  private getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
