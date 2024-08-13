import { RoleEnum } from 'src/enum/role.enum';

export const ADMIN_ROLES = [RoleEnum.ADMIN];

export const hasRoles = (userRoles: string[], roles: string[]) => {
  return roles.some((role) => userRoles.includes(role));
};
