import { ContentService } from '@features/content';
import { RoleService } from '@features/roles';
import { UserTeamService } from '@features/users/user-team';
import { TeamIdContextRequest } from '@interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class PolicyResourcesService {
  private readonly logger = new Logger(PolicyResourcesService.name);
  constructor(
    private readonly als: AsyncLocalStorage<TeamIdContextRequest>,
    private readonly userTeamService: UserTeamService,
    private readonly roleService: RoleService,
    private readonly contentService: ContentService,
  ) {}

  async getAllUsersInTeam(ids: number[] = []) {
    this.logger.log(`Getting all users in team ${this.als.getStore()?.teamId}`);
    return this.userTeamService.getAllUsersInTeam(ids);
  }

  async getAllRoles(ids: number[] = []) {
    this.logger.log(`Getting all roles in team ${this.als.getStore()?.teamId}`);
    return this.roleService.findAll(ids);
  }

  async getAllPosts(ids: number[] = []) {
    this.logger.log(`Getting all posts in team ${this.als.getStore()?.teamId}`);
    return this.contentService.findAll(ids);
  }
}
