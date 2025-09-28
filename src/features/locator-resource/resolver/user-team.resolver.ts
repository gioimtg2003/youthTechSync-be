import { SYSTEM_RESOURCE } from '@constants';
import { Injectable } from '@nestjs/common';
import { IResourceResolver } from './type';

@Injectable()
export class UserTeamResolver implements IResourceResolver {
  supports(resource: SYSTEM_RESOURCE) {
    return resource === SYSTEM_RESOURCE['user-team'];
  }

  async getTeamId(resourceId: number) {
    return resourceId;
  }
}
