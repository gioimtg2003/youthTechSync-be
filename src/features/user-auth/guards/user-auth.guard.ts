import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthError } from 'src/constants/error.constant';
import { IUserSession } from 'src/interfaces';

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
