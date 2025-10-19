import { TeamContextService } from '@common/modules';
import { HEADER_TEAM_ALIAS, SystemError } from '@constants';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TeamMiddleware implements NestMiddleware {
  constructor(private readonly teamContext: TeamContextService) {}

  use(req: Request, _: Response, next: NextFunction) {
    const team = req.headers[HEADER_TEAM_ALIAS] as string;

    if (!team) {
      throw new BadRequestException(SystemError.REQUIRED_TEAM_ALIAS);
    }
    this.teamContext.run(team, () => next());
  }
}
