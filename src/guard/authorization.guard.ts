import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isJWT } from 'class-validator';
import { Observable } from 'rxjs';

import { JwtInterface, PermissionInterface } from '../interface/jwt.interface';

/**
 * A guard checking whether the request has an access token and the string is a valid JWT token(without token validation)
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicController = this.reflector.get<boolean>(
      'isPublic',
      context.getClass(),
    );
    const isPublicMethod = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublicController || isPublicMethod) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (
      request &&
      request.headers &&
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer ')
    ) {
      const jwt = request.headers.authorization.replace('Bearer ', '');
      if (isJWT(jwt)) {
        request.currentUser = <JwtInterface>this.jwtService.decode(jwt);
        this.logger.debug(
          `Decoded and Validating the token ${request.currentUser}`,
        );
        request.currentUser.permissions =
          <Array<PermissionInterface>>(
            this.parsePermissions(request.currentUser.permissions)
          ) || [];
        return true;
      }
    }
    return false;
  }

  parsePermissions(permissions: string[]): Array<PermissionInterface> {
    if (!permissions) {
      return [];
    } else {
      const parsed = new Array<PermissionInterface>();
      Object.keys(permissions).forEach((key) => {
        const p = key.toLowerCase().split('_');
        parsed.push({
          action: p[0],
          possession: p[1],
          resource: p[2],
          attributes: permissions[key],
        });
      });
      return parsed;
    }
  }
}
