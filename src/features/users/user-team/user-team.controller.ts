import { PermissionGuard } from '@common/guard';
import { ActionPermission, VERSIONING_API } from '@constants';
import { CurrentUser, RequirePolicies } from '@decorators';
import { IUserSession } from '@interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AddUserToTeamDto, LeaveTeamDto, RemoveUserFromTeamDto } from './dto';
import { UserTeamService } from './user-team.service';

@ApiTags('User Team')
@Controller({ path: 'user-team', version: VERSIONING_API.v1 })
export class UserTeamController {
  constructor(private readonly userTeamService: UserTeamService) {}
  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, 'user-team');
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
    return ability.can(ActionPermission.create, 'user-team');
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User added to team successfully',
    type: Boolean,
  })
  addToTeam(@Body() body: AddUserToTeamDto) {
    return this.userTeamService.addUserToTeam(body.userId, body.teamId);
  }

  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.delete, 'user-team');
  })
  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User removed from team successfully',
    type: Boolean,
  })
  deleteUserFromTeam(@Body() body: RemoveUserFromTeamDto) {
    return this.userTeamService.deleteUserFromTeam(body.userId, body.teamId);
  }

  @UseGuards(PermissionGuard)
  @Delete('leave')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User left the team successfully',
    type: Boolean,
  })
  leaveTeam(@Body() body: LeaveTeamDto, @CurrentUser() user: IUserSession) {
    return this.userTeamService.deleteUserFromTeam(user.id, body.teamId);
  }
}
