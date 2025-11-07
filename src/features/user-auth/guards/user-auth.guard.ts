import { AuthError } from '@constants';
import { IUserSession, TeamIdContextRequest } from '@interfaces';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly als: AsyncLocalStorage<TeamIdContextRequest>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userSession = request?.session?.user as IUserSession;

    if (!userSession) {
      throw new UnauthorizedException(AuthError.AUTH_INVALID_SESSION);
    }

    // VALIDATE user belong team
    const store = this.als.getStore();
    if (store && userSession.teams.indexOf(store.teamId) === -1) {
      throw new UnauthorizedException(AuthError.AUTH_USER_NOT_IN_TEAM);
    }

    return true;
  }
}
