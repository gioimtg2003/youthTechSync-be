import { UserError } from '@constants';
import { CryptoService } from '@features/crypto';
import { UserService } from '@features/users';
import { User } from '@features/users/entities/user.entity';
import { IUserSession } from '@interfaces';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async register(userData: Partial<User>) {
    const { password, email } = userData;

    const found = await this.userService.findByUsernameOrEmail(email, ['id']);

    if (found) throw new BadRequestException(UserError.USER_ALREADY_EXISTS);

    const user = await this.userService.create({
      email,
      password,
    });

    if (!user) {
      throw new BadRequestException(UserError.USER_CANNOT_CREATE);
    }

    return true;
  }

  async validate(email: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(
      email,
      [],
      ['roles', 'teams'],
    );
    this.logger.log(`Validating user: ${email}`);

    if (!user) return null;

    const passwordValid = await this.cryptoService.compareHash(
      password,
      user.password,
    );
    if (!passwordValid) return null;

    return user;
  }

  createUserSession(user: User) {
    const userSession: IUserSession = {
      id: user.id,
      // username: user.username,
      email: user.email,
      plan: user.plan,
      roles: user.roles?.map((role) => role.name) || [],
      teams: user.teams?.map((team) => team.id) || [],
      isAdmin: user?.roles?.some((role) => role.isAdmin === true) || false,
      permissions: user?.roles?.flatMap((role) => role.permission) || [],
    };

    return userSession;
  }
}
