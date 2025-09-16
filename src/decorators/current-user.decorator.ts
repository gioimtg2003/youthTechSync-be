import { UserError } from '@constants';
import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  async (_: any, context: ExecutionContext) => {
    const logger = new Logger(CurrentUser.name);
    logger.debug('Start getting current user');
    const req = context.switchToHttp().getRequest();
    const user = await req?.session?.user;
    logger.debug('User: ' + JSON.stringify(user));

    if (!user?.id) {
      logger.error('User not found');
      throw new NotFoundException(UserError.USER_NOT_FOUND);
    }

    return user;
  },
);
