import { PermissionGuard } from '@common/guard';
import { ActionPermission, VERSIONING_API } from '@constants';
import { RequirePolicies } from '@decorators';
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
  path: 'policy',
  version: VERSIONING_API.v1,
})
@ApiTags('Policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, 'policy');
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getPolicy() {
    return this.policyService.get();
  }
}
