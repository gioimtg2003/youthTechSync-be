import { PermissionGuard } from '@common/guard';
import { ActionPermission, SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { CurrentTeam, RequirePolicies } from '@decorators';
import { LocatorResourceGuard } from '@features/locator-resource';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PolicyIds } from 'src/decorators/policy-ids.decorator';
import { ResourceService } from './resource.service';

@ApiTags('Resource')
@Controller({
  path: SYSTEM_RESOURCE.resource,
  version: VERSIONING_API.v1,
})
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @UseGuards(LocatorResourceGuard(SYSTEM_RESOURCE.resource), PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, SYSTEM_RESOURCE.resource);
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Resources retrieved successfully',
    type: Boolean,
  })
  get(
    @PolicyIds(SYSTEM_RESOURCE.resource) resourceIds: number[],
    @CurrentTeam() teamId: number,
  ) {
    return this.resourceService.get(teamId, resourceIds);
  }
}
