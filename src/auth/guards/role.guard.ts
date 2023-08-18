import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleExtended } from 'src/common/types/role.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.get<RoleExtended | RoleExtended[]>(
      'roles',
      context.getHandler(),
    );

    if (!(roles instanceof Array)) {
      roles = [roles];
    }

    if (roles.includes('ANY')) {
      // If any can access the route, we don't need to check user's role
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // This guard expect an user to be attached to the request
    if (!user) {
      return false;
    }

    // Super admins have access to everything...
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    const hasRole = roles.includes(user.role);

    return hasRole;
  }
}
