import { PermissionGuard } from '@common/guard';
import { ActionPermission, SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { HeaderTeamAlias, RequirePolicies } from '@decorators';
import { UserAuthGuard } from '@features/user-auth/guards';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PolicyIds } from 'src/decorators/policy-ids.decorator';
import { PolicyResourcesService } from './policy-resouces.service';

@ApiTags('Policy Resources')
@Controller({
  path: 'policy-resources',
  version: VERSIONING_API.v1,
})
@UseGuards(PermissionGuard, UserAuthGuard)
@HeaderTeamAlias()
export class PolicyResourcesController {
  constructor(private readonly policyService: PolicyResourcesService) {}

  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, 'user-team');
  })
  @Get('/user-team')
  @HttpCode(HttpStatus.OK)
  getResources(@PolicyIds(SYSTEM_RESOURCE['user-team']) resourceIds: number[]) {
    return this.policyService.getAllUsersInTeam(resourceIds);
  }
}
