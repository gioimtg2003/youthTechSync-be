import { MailService } from '@common/services/mail';
import { LIMIT_PLAN_CREATE_TEAM, TeamError, UserError } from '@constants';
import { CryptoService } from '@features/crypto';
import { User } from '@features/users/entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateTeamDto } from './dto';
import { TeamInvite } from './entities/team-invite.entity';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamInvite)
    private readonly teamInviteRepository: Repository<TeamInvite>,
    private readonly dataSource: DataSource,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
  ) {}

  async findById(
    id: number,
    select: FindOneOptions<Team>['select'] = [],
    relations: string[] = [],
  ) {
    const team = await this.teamRepository.findOne({
      where: { id },
      select,
      relations: relations?.length ? relations : undefined,
    });

    return team;
  }

  async create(input: CreateTeamDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        select: ['plan'],
      });

      if (!user) {
        throw new NotFoundException(UserError.USER_NOT_FOUND);
      }

      const teamCount = await queryRunner.manager.count(Team, {
        where: { createdBy: { id: user.id } },
      });

      const limit = LIMIT_PLAN_CREATE_TEAM[user.plan];
      if (teamCount > limit) {
        throw new ForbiddenException(UserError.USER_REACHES_CREATE_TEAM_LIMIT);
      }

      const team = queryRunner.manager.create(Team, {
        ...input,
        users: [{ id: userId }],
        createdBy: { id: userId },
      });

      await queryRunner.manager.save(team);

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, input: Partial<Team>) {
    const result = await this.teamRepository.update(
      { id },
      {
        name: input.name,
        alias: input.alias,
        logoUrl: input.logoUrl,
        settings: input.settings,
      },
    );
    if (result.affected === 0) {
      throw new NotFoundException(TeamError.TEAM_NOT_FOUND);
    }

    return true;
  }

  async delete(id: number) {
    const result = await this.teamRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(TeamError.TEAM_NOT_FOUND);
    }

    return true;
  }

  /**
   * get all team of user
   */
  async getTeamByUserId(id: number) {
    this.logger.log(`Getting team for user ${id}`);
    const teams = await this.teamRepository.find({
      where: {
        users: { id },
      },
      select: ['id', 'name', 'alias', 'logoUrl', 'settings'],
    });
    return teams;
  }

  async findByAlias(alias: string) {
    const team = await this.teamRepository.findOne({
      where: { alias },
      select: ['id', 'name', 'alias'],
    });
    return team;
  }

  /**
   * Create an invite link for a team
   */
  async createInvite(
    teamId: number,
    userId: number,
    email?: string,
  ): Promise<string> {
    this.logger.log(`Creating invite for team ${teamId} by user ${userId}`);

    const team = await this.findById(teamId, ['id', 'name']);
    if (!team) {
      throw new NotFoundException(TeamError.TEAM_NOT_FOUND);
    }

    const user = await this.dataSource.manager.findOne(User, {
      where: { id: userId },
      select: ['id', 'email'],
    });

    if (!user) {
      throw new NotFoundException(UserError.USER_NOT_FOUND);
    }

    // Generate unique token
    const token = this.cryptoService.generateToken() + Date.now().toString(36);

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = this.teamInviteRepository.create({
      token,
      teamId,
      invitedBy: userId,
      email,
      expiresAt,
    });

    const saved = await this.teamInviteRepository.save(invite);

    if (!saved) {
      throw new BadRequestException(TeamError.INVITE_CREATION_FAILED);
    }

    // Generate invite link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/invites/${token}`;

    // Send email if email is provided
    if (email) {
      await this.mailService.sendInviteEmail(
        email,
        user.email,
        team.name,
        inviteLink,
      );
    }

    return inviteLink;
  }

  /**
   * Validate and get invite by token
   */
  async getInviteByToken(token: string): Promise<TeamInvite> {
    const invite = await this.teamInviteRepository.findOne({
      where: { token },
      relations: ['team', 'inviter'],
    });

    if (!invite) {
      throw new NotFoundException(TeamError.INVITE_TOKEN_NOT_FOUND);
    }

    if (invite.usedAt) {
      throw new BadRequestException(TeamError.INVITE_TOKEN_ALREADY_USED);
    }

    if (new Date() > invite.expiresAt) {
      throw new BadRequestException(TeamError.INVITE_TOKEN_EXPIRED);
    }

    return invite;
  }

  /**
   * Mark invite as used
   */
  async markInviteAsUsed(token: string): Promise<boolean> {
    const result = await this.teamInviteRepository.update(
      { token },
      { usedAt: new Date() },
    );

    return result.affected > 0;
  }
}
