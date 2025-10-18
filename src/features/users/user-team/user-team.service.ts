import { TeamContextService } from '@common/modules';
import { DATABASE_TABLES, LIMIT_PLAN_CREATE_TEAM, UserError } from '@constants';
import { TeamService } from '@features/teams/team.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserTeamService {
  private readonly logger = new Logger(UserTeamService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly teamService: TeamService,
    private readonly teamContext: TeamContextService,
  ) {}

  async findUserById(
    id: number,
    selectFields: FindOneOptions<User>['select'] = [],
    relations: string[] = [],
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: selectFields,
      relations: relations?.length ? relations : undefined,
    });

    if (!user) {
      throw new BadRequestException(UserError.USER_NOT_FOUND);
    }

    return user;
  }

  async deleteUserFromTeam(
    userId: number,
    teamId: number,
    type: 'remove' | 'leave' = 'remove',
  ) {
    this.logger.log(`Removing user ${userId} from team ${teamId}`);

    const user = await this.findUserById(
      userId,
      {
        id: true,
        teams: {
          id: true,
        },
      },
      [DATABASE_TABLES.TEAMS],
    );

    const updatedTeams = (user.teams ?? []).filter(
      (team) => team.id !== teamId,
    );

    if (updatedTeams?.length === 0 && type === 'leave') {
      const createByUser = await this.teamService.findById(
        teamId,
        {
          createdBy: {
            id: true,
          },
        },
        [DATABASE_TABLES.USERS],
      );

      // if the user is the creator of the team, delete the team
      // otherwise, throw an error as the user cannot leave the team
      if (createByUser?.createdBy?.id === userId) {
        await this.teamService.delete(teamId);
      } else {
        throw new BadRequestException(UserError.USER_CANNOT_LEAVE_TEAM);
      }
    }

    const saved = await this.userRepository.save({
      ...user,
      teams: updatedTeams,
    });

    if (!saved) {
      throw new BadRequestException(UserError.USER_CANNOT_LEAVE_TEAM);
    }
    return true;
  }

  /**
   * Add user to team with max team join based on plan of user
   */
  async addUserToTeam(userId: number) {
    this.logger.log(
      `Adding user ${userId} to team ${this.teamContext.teamAlias}`,
    );

    const user = await this.findUserById(
      userId,
      {
        id: true,
        teams: {
          id: true,
          alias: true,
        },
        plan: true,
      },
      [DATABASE_TABLES.TEAMS],
    );

    if (!user?.teams?.find((team) => team.id === this.teamContext.teamId))
      throw new ForbiddenException(UserError.USER_CANNOT_JOIN_TEAM);

    const countTeams = user?.teams?.length ?? 0;
    const maxTeamJoin = LIMIT_PLAN_CREATE_TEAM[user.plan] ?? 0;

    if (countTeams >= maxTeamJoin) {
      throw new BadRequestException(UserError.USER_REACHES_JOIN_TEAM_LIMIT);
    }

    const saved = await this.userRepository.save({
      ...user,
      teams: [...(user.teams ?? []), { id: this.teamContext.teamId }],
    });

    if (!saved) {
      throw new BadRequestException(UserError.USER_CANNOT_JOIN_TEAM);
    }
    return true;
  }

  async getMyTeams(id: number) {
    this.logger.log(`Getting teams for user ${id}`);
    const teams = await this.userRepository
      .createQueryBuilder(DATABASE_TABLES.USERS)
      .leftJoinAndSelect(
        `${DATABASE_TABLES.USERS}.${DATABASE_TABLES.TEAMS}`,
        DATABASE_TABLES.TEAMS,
      )
      .select([
        `${DATABASE_TABLES.TEAMS}.id`,
        `${DATABASE_TABLES.TEAMS}.name`,
        `${DATABASE_TABLES.TEAMS}.alias`,
        `${DATABASE_TABLES.TEAMS}.logoUrl`,
        `${DATABASE_TABLES.TEAMS}.settings`,
      ])
      .where(`${DATABASE_TABLES.USERS}.id = :id`, { id: id })
      .getRawMany();

    this.logger.log(`Found ${teams?.length} teams for user ${id}`);

    return (teams ?? [])?.map((team) => ({
      id: team?.teams_id,
      name: team?.teams_name,
      alias: team?.teams_alias,
      logoUrl: team?.teams_logoUrl,
      settings: team?.teams_settings,
    }));
  }
}
