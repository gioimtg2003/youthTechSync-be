import { PermissionGuard } from '@common/guard';
import { ActionPermission, SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { RequirePolicies } from '@decorators';
import { UserAuthGuard } from '@features/user-auth/guards';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PolicyService } from './policy.service';

@Controller({
  path: SYSTEM_RESOURCE.policy,
  version: VERSIONING_API.v1,
})
@ApiTags('Policy')
@UseGuards(UserAuthGuard, PermissionGuard)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, 'policy');
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  getPolicy() {
    return this.policyService.get();
  }
}
