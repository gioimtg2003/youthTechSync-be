import { VERSIONING_API } from '@constants';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Team')
@Controller({ path: 'teams', version: VERSIONING_API.v1 })
export class TeamController {
  constructor() {}

  @ApiOperation({ summary: 'Create team (workspace)' })
  @Post()
  create() {}
}
