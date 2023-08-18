import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtFullAuthGuard } from '../guards/jwt-full-auth.guard';
import { AuthGuard } from '@nestjs/passport';

export function IsAuthenticatedFully() {
  return applyDecorators(UseGuards(AuthGuard('jwt'), JwtFullAuthGuard));
}
