import { ContextService } from '@common/modules/context';
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
  constructor(private readonly contextService: ContextService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userSession = request?.session?.user as IUserSession;

    if (!userSession) {
      throw new UnauthorizedException(AuthError.AUTH_INVALID_SESSION);
    }

    // VALIDATE user belong team
    const teamId = this.contextService.getData('tenantId');
    if (teamId && userSession.teams.indexOf(teamId) === -1) {
      throw new UnauthorizedException(AuthError.AUTH_USER_NOT_IN_TEAM);
    }

    return true;
  }
}
