import { SYSTEM_RESOURCE } from '@constants';
import { PostService } from '@features/posts';
import { Injectable } from '@nestjs/common';
import { IResourceResolver } from './type';

@Injectable()
export class PostResolver implements IResourceResolver {
  constructor(private readonly postService: PostService) {}

  supports(resource: SYSTEM_RESOURCE) {
    return resource === SYSTEM_RESOURCE.post;
  }

  async getTeamId(resourceId: number) {
    return (await this.postService.getTeamId(resourceId)) ?? null;
  }
}
