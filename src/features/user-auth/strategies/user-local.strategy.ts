import { AuthError } from '@constants';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { UserAuthService } from '../user-auth.service';
@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  'user-local',
) {
  private readonly logger = new Logger(UserLocalStrategy.name);
  constructor(private userAuthService: UserAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, email: string, password: string) {
    const _inviteToken = request?.body?.inviteToken || null;
    const user = await this.userAuthService.validate(email, password);

    if (!user) {
      this.logger.warn(`Invalid credentials for user: ${email}`);
      throw new UnauthorizedException(AuthError.AUTH_INVALID_CREDENTIALS);
    }

    return this.userAuthService.createUserSession(user);
  }
}
