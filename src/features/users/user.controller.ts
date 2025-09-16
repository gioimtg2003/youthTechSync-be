import { PermissionGuard } from '@common/guard';
import { ActionPermission, VERSIONING_API } from '@constants';
import { CurrentUser, RequirePolicies } from '@decorators';
import { IUserSession } from '@interfaces';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({ path: 'user', version: VERSIONING_API.v1 })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('teams')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User teams retrieved successfully',
    type: Boolean,
  })
  @UseGuards(PermissionGuard)
  @RequirePolicies((ability) => {
    return ability.can(ActionPermission.read, 'team');
  })
  getTeams(@CurrentUser() user: IUserSession) {
    return this.userService.getTeams(user?.id);
  }
}
