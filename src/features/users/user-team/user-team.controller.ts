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
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AddUserToTeamDto, RemoveUserFromTeamDto } from './dto';
import { UserTeamService } from './user-team.service';

@ApiTags('User Team')
@Controller({ path: SYSTEM_RESOURCE['user-team'], version: VERSIONING_API.v1 })
export class UserTeamController {
  constructor(private readonly userTeamService: UserTeamService) {}

  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, SYSTEM_RESOURCE['user-team']);
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User teams retrieved successfully',
    type: Boolean,
  })
  getTeams(@CurrentUser() user: IUserSession) {
    return this.userTeamService.getMyTeams(user?.id);
  }

  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return (
      ability.can(ActionPermission.create, SYSTEM_RESOURCE['user-team']) ||
      ability.can(ActionPermission.update, SYSTEM_RESOURCE['user-team'])
    );
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User added to team successfully',
    type: Boolean,
  })
  addToTeam(@Body() body: AddUserToTeamDto) {
    return this.userTeamService.addUserToTeam(body.userId);
  }

  @UseGuards(
    LocatorResourceGuard(SYSTEM_RESOURCE['user-team']),
    PermissionGuard,
  )
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.update, SYSTEM_RESOURCE['user-team']);
  })
  @Post('remove/:id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User removed from team successfully',
    type: Boolean,
  })
  deleteUserFromTeam(
    @Param('id', ParseIntPipe) teamId: number,
    @Body() body: RemoveUserFromTeamDto,
  ) {
    return this.userTeamService.deleteUserFromTeam(body.userId, teamId);
  }

  @UseGuards(
    LocatorResourceGuard(SYSTEM_RESOURCE['user-team']),
    PermissionGuard,
  )
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.update, SYSTEM_RESOURCE['user-team']);
  })
  @Post('leave/:id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User left the team successfully',
    type: Boolean,
  })
  leaveTeam(
    @Param('id', ParseIntPipe) teamId: number,
    @CurrentUser() user: IUserSession,
  ) {
    return this.userTeamService.deleteUserFromTeam(user.id, teamId, 'leave');
  }
}
