import { DATABASE_TABLES } from '@constants';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserTeamService {
  private readonly logger = new Logger(UserTeamService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

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
