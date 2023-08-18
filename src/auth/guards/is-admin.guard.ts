import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserHeader } from 'src/common/types/user-header.type';

@Injectable()
export class IsAdminGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Récupérez le résultat du JWTAuthGuard
    const canActivate = super.canActivate(context);

    // Vérifiez si canActivate est true et que le token contient authMode = "reset-password"
    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      const user: UserHeader = request.user;
      return user.role === 'admin';
    }

    return canActivate;
  }
}
