import { ApplicationEnum } from '../enum/application.enum';
import { RoleEnum } from '../enum/role.enum';

export interface JwtInterface {
  aud: string;
  exp: number;
  iat: number;
  iss: ApplicationEnum;
  permissions: PermissionInterface[];
  role: RoleEnum;
  sub: string;
}

export interface PermissionInterface {
  action: string;
  possession: string;
  resource: string;
  attributes: string[];
}
