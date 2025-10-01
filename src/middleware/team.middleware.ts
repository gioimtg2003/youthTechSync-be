import { TeamContextService } from '@common/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TeamMiddleware implements NestMiddleware {
  constructor(private readonly teamContext: TeamContextService) {}

  use(req: Request, _: Response, next: NextFunction) {
    const team = req.headers['x-team-alias'] as string;
    this.teamContext.run(team, () => next());
  }
}
