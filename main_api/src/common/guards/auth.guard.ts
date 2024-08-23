import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenService } from 'src/auth/jwt-token.service'
import { UsersService } from 'src/users/users.service';
import ErrorMessage from '../enums/error-message.enum';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { isUndefined } from 'lodash';
import { TokenFamily } from '../schema/tokenFamily.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
      // Verify token is valid
      const id = await this.jwtTokenService.verifyAccessToken(token);

      // Get token family
      const tokenFamily = await this.cacheManager.get<TokenFamily>(id);
      if (isUndefined(tokenFamily)) {
        throw new ForbiddenException("Invalid access token");
      }

      // Check whether token is latest
      if (tokenFamily.activeRefreshToken !== token) {
        await this.cacheManager.del(id);
        throw new ForbiddenException("Old access token used");
      }

      // Attach user data to request context
      const user = await this.usersService.getUser(id);
      const userJson = user.toJSON();
      this.logger.debug(`Authenticated user with id '${id}'`);
      request['user'] = userJson;
    } catch (error) {
      this.logger.warn(`Could not authenticate user as they had an invalid token`);
      this.logger.error(error)
    }
    return true;
  }

  private getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
