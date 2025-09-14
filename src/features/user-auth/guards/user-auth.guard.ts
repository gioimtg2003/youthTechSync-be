import { AuthError } from '@constants';
import { IUserSession } from '@interfaces';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userSession = request?.session?.user as IUserSession;

    if (!userSession) {
      throw new UnauthorizedException(AuthError.AUTH_INVALID_SESSION);
    }

    return true;
  }
}
