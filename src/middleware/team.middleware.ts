import { TeamContextService } from '@common/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TeamMiddleware implements NestMiddleware {
  constructor(private readonly teamContext: TeamContextService) {}

  use(req: Request, _: Response, next: NextFunction) {
    const team = req.headers['x-team-alias'] as string;

    if (!team) {
      return next();
    }
    this.teamContext.run(team, () => next());
  }
}
