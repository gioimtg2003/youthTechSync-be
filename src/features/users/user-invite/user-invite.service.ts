import { MailService } from '@common/modules';
import { ContextService } from '@common/modules/context';
import {
  InviteType,
  TeamError,
  USER_INVITE_TOKEN_EXPIRATION,
} from '@constants';
import { CryptoService } from '@features/crypto';
import { TeamService } from '@features/teams';
import { IUserSession } from '@interfaces';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvite } from '../entities/user-invite.entity';
import { UserTeamService } from '../user-team';
import { CreateUserInviteEvent, UserInviteEvents } from './events';

@Injectable()
export class UserInviteService {
  private readonly logger = new Logger(UserInviteService.name);
  private readonly tokenLength = 32;
  constructor(
    @InjectRepository(UserInvite)
    private readonly userInviteRepository: Repository<UserInvite>,
    private readonly cryptoService: CryptoService,
    private readonly contextService: ContextService,
    private readonly mailService: MailService,
    private readonly teamService: TeamService,
    private readonly userTeamService: UserTeamService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: number, inviteData: Partial<UserInvite>) {
    const { email, type } = inviteData ?? {};

    // suffix :0 indicates the first use of the invite, if re-invited, it will be :1, :2, ...
    const uid = `${this.cryptoService.generateToken(this.tokenLength)}:0`;
    const invite = this.userInviteRepository.create({
      uid,
      invitedBy: { id: userId },
      team: { id: inviteData?.team?.id },
      email,
      type,
    });
    const saved = await this.userInviteRepository.save(invite);

    if (!saved) {
      this.logger.error(
        `Failed to create invite for email ${inviteData.email}`,
      );
      return null;
    }

    this.logger.log(`Created invite ${saved.id} for email ${saved.email}`);
    return saved;
  }

  async getInvites() {
    const teamId = this.contextService.getData('tenantId');
    return this.userInviteRepository.find({
      where: { team: { id: teamId } },
      relations: ['invitedBy'],
      select: {
        id: true,
        email: true,
        type: true,
        createdAt: true,
        usedAt: true,
        invitedBy: { id: true, email: true },
      },
    });
  }

  async createInvite(
    userId: number,
    type: InviteType = InviteType.PRIVATE,
    email?: string,
  ) {
    const team = await this.teamService.findById(
      this.contextService.getData('tenantId'),
      { id: true, name: true },
    );

    if (!team) {
      this.logger.error(
        `Team ${this.contextService.getData('tenantId')} not found`,
      );

      throw new BadRequestException(TeamError.TEAM_NOT_FOUND);
    }
    const invite = await this.create(userId, { email, type, team });

    const url = `${process.env.FRONTEND_URL}/invited/${invite.uid}`;

    if (invite.type === InviteType.PRIVATE)
      this.eventEmitter.emit(
        UserInviteEvents.CREATE_USER_INVITE,
        new CreateUserInviteEvent(team.name, url, email, team.createdAt),
      );

    return team;
  }

  async resendInvite(inviteToken: string) {
    const invite = await this.userInviteRepository.findOne({
      where: { uid: inviteToken },
      relations: ['team'],
      select: {
        id: true,
        uid: true,
        email: true,
        type: true,
        team: { id: true, name: true },
      },
    });

    if (!invite) {
      this.logger.error(`Invite ${inviteToken} not found`);
      throw new BadRequestException(TeamError.INVITE_TOKEN_NOT_FOUND);
    }

    if (invite.type !== InviteType.PRIVATE) {
      this.logger.error(
        `Invite ${inviteToken} is not of type PRIVATE, cannot resend`,
      );
      throw new BadRequestException(TeamError.INVITE_CANNOT_RESEND);
    }

    const [uidPrefix, count] = invite.uid.split(':');
    invite.uid = `${uidPrefix}:${parseInt(count, 10) + 1}`; // update suffix to indicate re-invited

    const updated = await this.userInviteRepository.update(
      { id: invite.id },
      { uid: invite.uid },
    );

    if (updated?.affected === 0) {
      this.logger.error(`Failed to update invite ${invite.id} for resend`);
      throw new BadRequestException(TeamError.INVITE_CREATION_FAILED);
    }

    const url = `${process.env.FRONTEND_URL}/invited/${invite.uid}`;

    this.eventEmitter.emit(
      UserInviteEvents.CREATE_USER_INVITE,
      new CreateUserInviteEvent(invite.team.name, url, invite.email, null),
    );
    return true;
  }

  async getInviteByUid(uid: string) {
    const invite = await this.userInviteRepository.findOne({
      where: { uid },
      select: {
        id: true,
        uid: true,
        email: true,
        type: true,
        updatedAt: true,
        usedAt: true,
      },
    });

    if (!invite) {
      this.logger.error(`Invite with uid ${uid} not found`);
      throw new BadRequestException(TeamError.INVITE_TOKEN_NOT_FOUND);
    }

    if (invite.usedAt) {
      this.logger.error(`Invite with uid ${uid} has already been used`);
      throw new BadRequestException(TeamError.INVITE_TOKEN_ALREADY_USED);
    }

    const now = new Date().getTime();
    const updatedAt = new Date(invite.updatedAt).getTime();

    if (now - updatedAt > USER_INVITE_TOKEN_EXPIRATION) {
      this.logger.error(`Invite with uid ${uid} has expired`);
      throw new BadRequestException(TeamError.INVITE_TOKEN_EXPIRED);
    }

    return invite;
  }

  /**
   * Mark invite as used with usedAt timestamp
   * @param uid
   */
  async useInvite(user: IUserSession, uid: string, type: InviteType) {
    const invite = await this.getInviteByUid(uid);
    if (invite.email !== user.email) {
      this.logger.error(
        `Invite email ${invite.email} does not match user email ${user.email}`,
      );
      throw new BadRequestException(TeamError.INVITE_EMAIL_MISMATCH);
    }

    if (invite.type !== type) {
      this.logger.error(
        `Invite with uid ${uid} is not of type ${type}, cannot use`,
      );
      throw new BadRequestException(TeamError.INVITE_TOKEN_NOT_FOUND);
    }

    const updated = await this.userInviteRepository.update(
      { id: invite.id },
      { usedAt: new Date() },
    );

    if (updated?.affected === 0) {
      this.logger.error(`Failed to mark invite ${invite.id} as used`);
      throw new BadRequestException(TeamError.INVITE_CREATION_FAILED);
    }

    await this.userTeamService.addUserToTeam(user.id, invite?.team?.id);

    return true;
  }

  /**
   * Get first public url invite for the team or create new one
   */
  async generateInvitePublicUrl(userIdInvite: number) {
    // get first public url invite for the team, if exists return it else create new
    const existingInvite = await this.userInviteRepository.findOne({
      where: { team: { id: this.contextService.getData('tenantId') } },
    });
    const dateNow = Date.now();

    if (existingInvite) {
      const hash = await this.cryptoService.hash256(
        `${process.env.SECRET_GENERATE_PUBLIC_INVITE}:${userIdInvite}:${dateNow}:${existingInvite.uid}`,
      );

      return {
        url: `${process.env.FRONTEND_URL}/invited/${existingInvite.uid}?inviter=${userIdInvite}&time=${dateNow}&signature=${hash}`,
        invite: existingInvite,
      };
    }

    const team = await this.teamService.findById(
      this.contextService.getData('tenantId'),
      { id: true, name: true },
    );

    if (!team) {
      this.logger.error(
        `Team ${this.contextService.getData('tenantId')} not found`,
      );

      throw new BadRequestException(TeamError.TEAM_NOT_FOUND);
    }

    const invite = await this.create(userIdInvite, {
      type: InviteType.PUBLIC,
      team,
    });

    const hash = await this.cryptoService.hash256(
      `${process.env.SECRET_GENERATE_PUBLIC_INVITE}:${userIdInvite}:${dateNow}:${invite.uid}`,
    );

    return {
      url: `${process.env.FRONTEND_URL}/invited/${invite.uid}?inviter=${userIdInvite}&time=${dateNow}&signature=${hash}`,
      invite,
    };
  }

  @OnEvent(UserInviteEvents.CREATE_USER_INVITE)
  handleCreateUserInviteEvent(event: CreateUserInviteEvent) {
    const { teamName, url, email, time } = event;

    this.mailService.send({
      to: email,
      subject: `[Action required] - You're invited to join ${teamName}`,
      template: 'user-invite',
      context: {
        teamName,
        url,
        time,
      },
    });
  }
}
