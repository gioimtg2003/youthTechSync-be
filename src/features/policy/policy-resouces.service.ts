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
  ) {}

  async getAllUsersInTeam(ids: number[] = []) {
    this.logger.log(`Getting all users in team ${this.als.getStore()?.teamId}`);
    return this.userTeamService.getAllUsersInTeam(ids);
  }
}
