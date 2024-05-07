import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FlatUser } from 'src/users/user.schema';

export const User = createParamDecorator(
  (data: keyof FlatUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: FlatUser = request.user;
    return data ? user?.[data] : user;
  },
);
