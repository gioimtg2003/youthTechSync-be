import { EmailRegex, UserError } from '@constants';
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
    const condition = EmailRegex.test(input)
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
}
