import { SYSTEM_RESOURCE } from '@constants';
import { PostService } from '@features/posts/post.services';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

export const ActionAcrossAccess = (sysResource: SYSTEM_RESOURCE) => {
  const extractTeamSlug = (request: Request): string | undefined => {
    return (
      request.headers['x-team-slug'] ||
      request.body?.teamSlug ||
      request.query?.teamSlug ||
      request.params?.teamSlug
    );
  };

  @Injectable()
  class ActionAcrossAccessGuard implements CanActivate {
    constructor(public readonly postService: PostService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const teamSlug = extractTeamSlug(request);

      return true;
    }
  }

  return ActionAcrossAccessGuard;
};
