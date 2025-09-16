import { LIMIT_PLAN_CREATE_TEAM, UserError } from '@constants';
import { User } from '@features/users/entities/user.entity';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTeamDto } from './dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    @InjectRepository(Team) private readonly _: Repository<Team>,
    private readonly dataSource: DataSource,
  ) {}

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
}
