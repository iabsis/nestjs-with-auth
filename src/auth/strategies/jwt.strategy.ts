import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { AuthToken } from '../../common/types/auth-token.type';
import { UserHeader } from '../../common/types/user-header.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: AuthToken): Promise<UserHeader> {
    try {
      const details: UserHeader = await this.userService.findById(payload._id);
      if (!details) {
        throw new UnauthorizedException();
      }

      const userDetails = details.toObject();
      userDetails.authMode = payload.authMode;
      return userDetails;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
