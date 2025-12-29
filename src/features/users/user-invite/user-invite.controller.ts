import { PermissionGuard } from '@common/guard';
import {
  ActionPermission,
  InviteType,
  SYSTEM_RESOURCE,
  VERSIONING_API,
} from '@constants';
import { CurrentUser, HeaderTeamAlias, RequirePolicies } from '@decorators';
import { UserAuthGuard } from '@features/user-auth/guards';
import { IUserSession } from '@interfaces';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SendInviteDto } from './dto';
import { UseInvitePublicGuard } from './guards';
import { UserInviteService } from './user-invite.service';

@Controller({
  path: SYSTEM_RESOURCE['user-invite'],
  version: VERSIONING_API.v1,
})
@HeaderTeamAlias()
@UseGuards(UserAuthGuard, PermissionGuard)
export class UserInviteController {
  constructor(private readonly userInviteService: UserInviteService) {}

  @Get()
  @RequirePolicies((ability) =>
    ability.can(ActionPermission.read, SYSTEM_RESOURCE['user-invite']),
  )
  getInvites() {
    return this.userInviteService.getInvites();
  }

  @Post('/')
  @RequirePolicies((ability) =>
    ability.can(ActionPermission.create, SYSTEM_RESOURCE['user-invite']),
  )
  createInvitePrivate(
    @Body() sendInviteDto: SendInviteDto,
    @CurrentUser() user: IUserSession,
  ) {
    return this.userInviteService.createInvite(
      user.id,
      InviteType.PRIVATE,
      sendInviteDto?.email ?? '',
    );
  }

  @Post('resend-invite/:inviteId')
  @RequirePolicies((ability) =>
    ability.can(ActionPermission.create, SYSTEM_RESOURCE['user-invite']),
  )
  resendInvite(@Param('inviteId') inviteToken: string) {
    return this.userInviteService.resendInvite(inviteToken);
  }

  @Patch('use-invite/:inviteToken')
  useInvite(
    @Param('inviteToken') inviteToken: string,
    @CurrentUser() user: IUserSession,
  ) {
    return this.userInviteService.useInvite(
      user,
      inviteToken,
      InviteType.PRIVATE,
    );
  }

  @Patch('use-invite-public-url/:inviteToken')
  @UseGuards(UseInvitePublicGuard)
  useInviteTokenPublic(
    @Param('inviteToken') inviteToken: string,
    @CurrentUser() user: IUserSession,
  ) {
    return this.userInviteService.useInvite(
      user,
      inviteToken,
      InviteType.PUBLIC,
    );
  }

  @Get('generate-public-invite')
  @RequirePolicies((ability) =>
    ability.can(ActionPermission.create, SYSTEM_RESOURCE['user-invite']),
  )
  generatePublicInvite(@CurrentUser() user: IUserSession) {
    return this.userInviteService.generateInvitePublicUrl(user.id);
  }

  @Patch('action-join-request/:joinRequestId')
  @RequirePolicies((ability) =>
    ability.can(ActionPermission.update, SYSTEM_RESOURCE['user-invite']),
  )
  actionJoinRequest(
    @Param('joinRequestId') joinRequestId: number,
    @Body('approve') approve: boolean,
    @CurrentUser() user: IUserSession,
  ) {
    return this.userInviteService.actionUserJoinRequest(
      user.id,
      joinRequestId,
      approve,
    );
  }
}
