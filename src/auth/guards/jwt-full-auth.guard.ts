// reset-password-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserHeader } from 'src/common/types/user-header.type';

@Injectable()
export class JwtFullAuthGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserHeader = request.user;
    if (!user || user.authMode !== 'full') {
      throw new UnauthorizedException('Unauthorized access');
    }
    return true;
  }
}
