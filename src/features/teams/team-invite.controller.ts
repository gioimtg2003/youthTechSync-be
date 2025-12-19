import { VERSIONING_API } from '@constants';
import { CurrentUser } from '@decorators';
import { CryptoService } from '@features/crypto';
import { UserAuthGuard } from '@features/user-auth/guards';
import { UserAuthService } from '@features/user-auth/user-auth.service';
import { UserTeamService } from '@features/users/user-team/user-team.service';
import { IUserSession } from '@interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcceptInviteDto } from './dto';
import { TeamService } from './team.service';

@ApiTags('Team Invite')
@Controller({
  path: 'invites',
  version: VERSIONING_API.v1,
})
export class TeamInviteController {
  constructor(
    private readonly teamService: TeamService,
    private readonly userAuthService: UserAuthService,
    private readonly userTeamService: UserTeamService,
    private readonly cryptoService: CryptoService,
  ) {}

  @ApiOperation({ summary: 'Get invite details by token' })
  @Get(':token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Invite details retrieved successfully',
  })
  async getInvite(@Param('token') token: string) {
    const invite = await this.teamService.getInviteByToken(token);

    return {
      team: {
        id: invite.team.id,
        name: invite.team.name,
        alias: invite.team.alias,
      },
      inviter: {
        email: invite.inviter.email,
      },
      expiresAt: invite.expiresAt,
    };
  }

  @ApiOperation({
    summary: 'Accept invite (for logged-in users)',
  })
  @UseGuards(UserAuthGuard)
  @Post(':token/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Invite accepted successfully',
  })
  async acceptInvite(
    @Param('token') token: string,
    @CurrentUser() user: IUserSession,
  ) {
    const invite = await this.teamService.getInviteByToken(token);

    // Add user to team (checks if already in team internally)
    await this.userTeamService.addUserToTeamById(user.id, invite.teamId);

    // Mark invite as used
    await this.teamService.markInviteAsUsed(token);

    return { success: true, teamId: invite.teamId };
  }

  @ApiOperation({
    summary: 'Register and accept invite (for new users)',
  })
  @Post(':token/register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User registered and added to team successfully',
  })
  async registerAndAccept(
    @Param('token') token: string,
    @Body() userData: AcceptInviteDto,
    @Req() req: any,
  ) {
    const invite = await this.teamService.getInviteByToken(token);

    // Register the user
    await this.userAuthService.register({
      email: userData.email,
      password: userData.password,
    });

    // Login the user
    const user = await this.userAuthService.validate(
      userData.email,
      userData.password,
    );

    if (!user) {
      throw new UnauthorizedException('Registration failed');
    }

    // Set session
    const userSession = this.userAuthService.createUserSession(user);
    req.session.user = userSession;

    // Add user to team
    await this.userTeamService.addUserToTeamById(user.id, invite.teamId);

    // Mark invite as used
    await this.teamService.markInviteAsUsed(token);

    return { success: true, teamId: invite.teamId };
  }
}
