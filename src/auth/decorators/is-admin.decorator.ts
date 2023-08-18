import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtFullAuthGuard } from '../guards/jwt-full-auth.guard';
import { IsAdminGuard } from '../guards/is-admin.guard';
import { AuthGuard } from '@nestjs/passport';

export function IsAdmin() {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), JwtFullAuthGuard, IsAdminGuard),
  );
}
