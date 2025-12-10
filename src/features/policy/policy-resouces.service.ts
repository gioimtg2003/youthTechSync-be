import { ContextService } from '@common/modules/context';
import { ContentService } from '@features/content';
import { RoleService } from '@features/roles';
import { UserTeamService } from '@features/users/user-team';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PolicyResourcesService {
  private readonly logger = new Logger(PolicyResourcesService.name);
  constructor(
    private readonly userTeamService: UserTeamService,
    private readonly roleService: RoleService,
    private readonly contentService: ContentService,
    private readonly contextService: ContextService,
  ) {}

  async getAllUsersInTeam(ids: number[] = []) {
    this.logger.log(
      `Getting all users in team ${this.contextService.getData('tenantId')}`,
    );
    return this.userTeamService.getAllUsersInTeam(ids);
  }

  async getAllRoles(ids: number[] = []) {
    this.logger.log(
      `Getting all roles in team ${this.contextService.getData('tenantId')}`,
    );
    return this.roleService.findAll(ids);
  }

  async getAllPosts(ids: number[] = []) {
    this.logger.log(
      `Getting all posts in team ${this.contextService.getData('tenantId')}`,
    );
    return this.contentService.findAll(ids);
  }
}
