import { PermissionGuard } from '@common/guard';
import { ActionPermission, SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { HeaderTeamAlias, RequirePolicies } from '@decorators';
import { UserAuthGuard } from '@features/user-auth/guards';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller({
  path: SYSTEM_RESOURCE.role,
  version: VERSIONING_API.v1,
})
@HeaderTeamAlias()
@UseGuards(PermissionGuard, UserAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.create, SYSTEM_RESOURCE.role);
  })
  @Post()
  @ApiOkResponse({ type: Boolean })
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }
}
