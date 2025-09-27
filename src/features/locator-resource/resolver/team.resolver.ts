import { SYSTEM_RESOURCE } from '@constants';
import { Injectable } from '@nestjs/common';
import { IResourceResolver } from './type';

@Injectable()
export class TeamResolver implements IResourceResolver {
  supports(resource: SYSTEM_RESOURCE): boolean {
    return resource === SYSTEM_RESOURCE.team;
  }
  async getTeamId(resourceId: number): Promise<number | null> {
    return resourceId;
  }
}
