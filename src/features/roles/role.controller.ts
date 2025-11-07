import { SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller({
  path: SYSTEM_RESOURCE.role,
  version: VERSIONING_API.v1,
})
export class RoleController {}
