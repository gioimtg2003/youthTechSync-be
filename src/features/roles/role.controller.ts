import { SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { HeaderTeamAlias } from '@decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto';

@ApiTags('Role')
@Controller({
  path: SYSTEM_RESOURCE.role,
  version: VERSIONING_API.v1,
})
@HeaderTeamAlias()
export class RoleController {
  constructor() {}

  @ApiBody({ type: CreateRoleDto })
  @Post()
  @ApiOkResponse({ type: Boolean })
  create(@Body() data: CreateRoleDto) {
    return data;
  }
}
