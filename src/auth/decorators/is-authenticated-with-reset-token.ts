import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtResetPasswordAuthGuard } from '../guards/jwt-reset-password-auth.guard';
import { AuthGuard } from '@nestjs/passport';

export function isAuthenticatedWithResetToken() {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), JwtResetPasswordAuthGuard),
  );
}
