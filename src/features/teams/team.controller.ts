import { PermissionGuard } from '@common/guard';
import { ActionPermission, VERSIONING_API } from '@constants';
import { CurrentUser, RequirePolicies } from '@decorators';
import { IUserSession } from '@interfaces';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from './dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@Controller({ path: 'team', version: VERSIONING_API.v1 })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Create team (workspace)' })
  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.create, 'Team');
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Team created successfully',
    type: Boolean,
  })
  create(@Body() input: CreateTeamDto, @CurrentUser() user: IUserSession) {
    return this.teamService.create(input, user?.id);
  }
}
