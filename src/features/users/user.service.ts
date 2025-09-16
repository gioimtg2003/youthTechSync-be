import { DATABASE_TABLES, UserError } from '@constants';
import { CryptoService } from '@features/crypto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async findById(id: number, select?: (keyof User)[], relations?: string[]) {
    const user = await this.userRepository.findOne({
      where: { id },
      select,
      relations,
    });
    return user;
  }

  async findByUsernameOrEmail(
    input: string,
    select?: (keyof User)[],
    relations?: string[],
  ) {
    const emailRegex = /^[\w-.]+@([\w-.]+(\.[\w-.]+)+)$/;

    const condition = emailRegex.test(input)
      ? { email: input }
      : { username: input };

    const user = await this.userRepository.findOne({
      where: condition,
      select,
      relations,
    });

    return user;
  }

  async create(userData: Partial<User>) {
    // prevent plan from being set during creation
    const { password, ...restInput } = userData;

    const hashPassword = await this.cryptoService.hash(password);

    const user = this.userRepository.create({
      ...restInput,
      password: hashPassword,
    });
    const saved = await this.userRepository.save(user);

    if (!saved) {
      throw new BadRequestException(UserError.USER_CANNOT_CREATE);
    }

    this.logger.log(`Created user ${saved.id}`);

    return saved;
  }

  async getTeams(id: number) {
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
