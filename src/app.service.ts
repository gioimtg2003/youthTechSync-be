import { UserService } from '@features/users';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    const found = await this.userService.findByUsernameOrEmail(
      process.env.ROOT_USER_EMAIL,
      ['id'],
    );

    if (!found) {
      this.userService.create({
        email: process.env.ROOT_USER_EMAIL,
        password: process.env.ROOT_USER_PASSWORD,
      });
    }
  }

  async addRootAccount(username: string, email: string, password: string) {
    const found = await this.userService.findByUsernameOrEmail(username, [
      'id',
    ]);

    if (!found) {
      await this.userService.create({
        email,
        password,
      });

      return true;
    }
    return null;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
