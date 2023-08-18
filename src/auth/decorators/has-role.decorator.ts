import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { RoleExtended } from 'src/common/types/role.type';
import { RoleGuard } from '../guards/role.guard';
import { JwtFullAuthGuard } from '../guards/jwt-full-auth.guard';
import { IsAuthenticatedFully } from './is-authenticated-fully.decorator';

export function HasRole(roles: RoleExtended | RoleExtended[]) {
  return applyDecorators(
    ApiBearerAuth(),
    IsAuthenticatedFully(),
    Roles(roles),
    UseGuards(JwtFullAuthGuard, RoleGuard),
  );
}
