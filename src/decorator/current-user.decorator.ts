import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * A param decorator building @CurrentUser annotation according to request.currentUser
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try {
      return request.currentUser;
    } catch (e) {
      return {};
    }
  },
);
