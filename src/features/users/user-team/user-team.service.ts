import { DATABASE_TABLES, LIMIT_PLAN_CREATE_TEAM, UserError } from '@constants';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserTeamService {
  private readonly logger = new Logger(UserTeamService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUserById(
    id: number,
    selectFields: (keyof User)[] = [],
    relations: string[] = [],
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: selectFields?.length ? selectFields : undefined,
      relations: relations?.length ? relations : undefined,
    });

    if (!user) {
      throw new BadRequestException(UserError.USER_NOT_FOUND);
    }

    return user;
  }

  // TODO: logic check permission before leave team
  // case 1: user is the last admin in the team
  // case 2: user is not in the team
  async deleteUserFromTeam(userId: number, teamId: number) {
    this.logger.log(`Removing user ${userId} from team ${teamId}`);

    const user = await this.findUserById(
      userId,
      ['id', 'teams'],
      [DATABASE_TABLES.TEAMS],
    );

    const updatedTeams = (user.teams ?? []).filter(
      (team) => team.id !== teamId,
    );
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
  async addUserToTeam(userId: number, teamId: number) {
    this.logger.log(`Adding user ${userId} to team ${teamId}`);

    const user = await this.findUserById(
      userId,
      ['id', 'plan', 'teams'],
      [DATABASE_TABLES.TEAMS],
    );

    const countTeams = user?.teams?.length ?? 0;
    const maxTeamJoin = LIMIT_PLAN_CREATE_TEAM[user.plan] ?? 0;

    if (countTeams >= maxTeamJoin) {
      throw new BadRequestException(UserError.USER_REACHES_JOIN_TEAM_LIMIT);
    }

    const saved = await this.userRepository.save({
      ...user,
      teams: [...(user.teams ?? []), { id: teamId }],
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
