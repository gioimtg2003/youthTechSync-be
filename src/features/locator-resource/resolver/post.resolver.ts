import { SYSTEM_RESOURCE } from '@constants';
import { ContentService } from '@features/content';
import { Injectable } from '@nestjs/common';
import { IResourceResolver } from './type';

@Injectable()
export class PostResolver implements IResourceResolver {
  constructor(private readonly contentService: ContentService) {}

  supports(resource: SYSTEM_RESOURCE) {
    return resource === SYSTEM_RESOURCE.content;
  }

  async getTeamId(resourceId: number) {
    return (await this.contentService.getTeamId(resourceId)) ?? null;
  }
}
