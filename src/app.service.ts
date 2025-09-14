import { UserPlan } from '@constants';
import { UserService } from '@features/users';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    const found = await this.userService.findByUsernameOrEmail(
      process.env.ROOT_USER_NAME,
      ['id'],
    );

    if (!found) {
      this.userService.create({
        username: process.env.ROOT_USER_NAME,
        email: process.env.ROOT_USER_EMAIL,
        password: process.env.ROOT_USER_PASSWORD,
        plan: UserPlan.UNLIMITED,
      });
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
