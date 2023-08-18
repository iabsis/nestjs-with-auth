import { SetMetadata } from '@nestjs/common';
import { RoleExtended } from 'src/common/types/role.type';

export const Roles = (roles: RoleExtended | RoleExtended[]) =>
  SetMetadata('roles', roles);
