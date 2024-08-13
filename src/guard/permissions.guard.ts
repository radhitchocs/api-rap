import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { JwtInterface, PermissionInterface } from '../interface/jwt.interface';
import { PermissionMetadataInterface } from '../interface/permission-metadata.interface';

/**
 * A guard will check for the user permissions, then if the user have the permissions to access this resource the guard will return true, else it will throw a ForbiddenException.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const methodPermissions =
      this.reflector.get<PermissionMetadataInterface[]>(
        'Permissions',
        context.getHandler(),
      ) || [];
    const classPermissions =
      this.reflector.get<PermissionMetadataInterface[]>(
        'Permissions',
        context.getClass(),
      ) || [];
    const requiredPermissions = classPermissions.concat(methodPermissions);

    if (!requiredPermissions || requiredPermissions.length == 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const currentUser: JwtInterface = request.currentUser;
    const userPermissions: PermissionInterface[] =
      currentUser.permissions || [];

    return requiredPermissions.every(
      (required: PermissionMetadataInterface) => {
        return userPermissions.find((permission) => {
          const sameAction = permission.action == required.action;
          const sameResource = permission.resource == required.resource;
          if (Array.isArray(required.possession)) {
            const orPossession = required.possession;
            return (
              sameAction &&
              orPossession.includes(permission.possession) &&
              sameResource
            );
          } else {
            return (
              sameAction &&
              permission.possession == required.possession &&
              sameResource
            );
          }
        });
      },
    );
  }
}
