import { PermissionGuard } from '@common/guard';
import { ActionPermission, SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { CurrentUser, RequirePolicies } from '@decorators';

import { LocatorResourceGuard } from '@features/locator-resource';
import { IUserSession } from '@interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateInviteDto, CreateTeamDto } from './dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@Controller({ path: SYSTEM_RESOURCE.team, version: VERSIONING_API.v1 })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Get team (workspace)' })
  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, SYSTEM_RESOURCE.team);
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Team retrieved successfully',
    type: Boolean,
  })
  get(@CurrentUser() user: IUserSession) {
    return this.teamService.getTeamByUserId(user?.id);
  }

  @ApiOperation({ summary: 'Create team (workspace)' })
  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.create, SYSTEM_RESOURCE.team);
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

  @UseGuards(LocatorResourceGuard(SYSTEM_RESOURCE.team), PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.update, SYSTEM_RESOURCE.team);
  })
  @Patch(':teamAlias')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Team updated successfully', type: Boolean })
  update(@Param('id') id: number, @CurrentUser() user: IUserSession) {
    return user;
  }

  @ApiOperation({ summary: 'Create invite link for team' })
  @UseGuards(LocatorResourceGuard(SYSTEM_RESOURCE.team), PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.manage, SYSTEM_RESOURCE.team);
  })
  @Post(':teamAlias/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Invite link created successfully',
    type: String,
  })
  async createInvite(
    @Param('teamAlias') teamAlias: string,
    @Body() input: CreateInviteDto,
    @CurrentUser() user: IUserSession,
  ) {
    const team = await this.teamService.findByAlias(teamAlias);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return this.teamService.createInvite(team.id, user?.id, input.email);
  }
}
