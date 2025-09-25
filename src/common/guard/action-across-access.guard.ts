import { SYSTEM_RESOURCE } from '@constants';
import { PostService } from '@features/posts/post.services';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

export const ActionAcrossAccess = (sysResource: SYSTEM_RESOURCE) => {
  @Injectable()
  class ActionAcrossAccessGuard implements CanActivate {
    constructor(public readonly postService: PostService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const teamId = request.body?.teamId || request.query?.teamId;
      return true;
    }
  }
  return ActionAcrossAccessGuard;
};
