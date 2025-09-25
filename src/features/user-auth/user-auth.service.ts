import { CryptoService } from '@features/crypto';
import { UserService } from '@features/users';
import { User } from '@features/users/entities/user.entity';
import { IUserSession } from '@interfaces';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async validate(username: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(
      username,
      [],
      ['roles', 'teams'],
    );
    this.logger.log(`Validating user: ${username}`);

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
      username: user.username,
      email: user.email,
      plan: user.plan,
      roles: user.roles?.map((role) => role.name) || [],
      teams: user.teams?.map((team) => team.alias) || [],
      isAdmin: user?.roles?.some((role) => role.isAdmin === true) || false,
      permissions: user?.roles?.flatMap((role) => role.permission) || [],
    };

    return userSession;
  }
}
