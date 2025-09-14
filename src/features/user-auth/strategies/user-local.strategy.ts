import { AuthError } from '@constants';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserAuthService } from '../user-auth.service';
@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  'user-local',
) {
  private readonly logger = new Logger(UserLocalStrategy.name);
  constructor(private userAuthService: UserAuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string) {
    const user = await this.userAuthService.validate(username, password);

    if (!user) {
      this.logger.warn(`Invalid credentials for user: ${username}`);
      throw new UnauthorizedException(AuthError.AUTH_INVALID_CREDENTIALS);
    }

    return this.userAuthService.createUserSession(user);
  }
}
