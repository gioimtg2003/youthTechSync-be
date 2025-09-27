import { DEFAULT_ID, SYSTEM_RESOURCE } from '@constants';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { ResourceLocatorService } from '../resolver';
/**
 * This guard is used to check if the user has access to the resource
 * - ROLE: id of resource always :id in route params
 * - Example: /posts/:id
 * - Resource: `SYSTEM_RESOURCE.post`
 */
export function LocatorResourceGuard(
  resource: SYSTEM_RESOURCE,
): Type<CanActivate> {
  @Injectable()
  class _LocatorGuard implements CanActivate {
    constructor(private readonly resourceLocator: ResourceLocatorService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const id = +req.params?.id || DEFAULT_ID;

      const teamId = await this.resourceLocator.getTeamIdForResource(
        resource,
        id,
      );
      const userTeams: number[] = req.session?.user?.teams || [];
      return userTeams.includes(teamId);
    }
  }

  return mixin(_LocatorGuard);
}
