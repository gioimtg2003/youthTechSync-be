import { TeamContextService } from '@common/modules';
import { HEADER_TEAM_ID, SystemError } from '@constants';
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
    const teamId = req.headers[HEADER_TEAM_ID] as string;
    console.log('🚀 ~ TeamMiddleware ~ use ~ teamId:', teamId);

    if (!teamId || isNaN(Number(teamId))) {
      throw new BadRequestException(SystemError.REQUIRED__HEADER_TEAM_ID);
    }
    this.teamContext.run(Number(teamId), () => next());
  }
}
