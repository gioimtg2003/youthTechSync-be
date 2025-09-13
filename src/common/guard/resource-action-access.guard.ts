import { PostService } from '@features/posts/post.services';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ResourceActionAccessGuard implements CanActivate {
  constructor(private postService: PostService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const user = request.user;

    const postId = this.getPostId(url);
    if (!postId) return true;

    const teamId = await this.postService.getTeamId(postId);
    if (!teamId) return false;
    if (!user?.teams?.some((team) => team?.id === teamId)) return false;

    return true;
  }

  getPostId(url: string) {
    const regex = /\/posts\/(\d+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return null;
  }
}
