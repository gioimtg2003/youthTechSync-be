import { ContextService } from '@common/modules/context';
import { HEADER_TEAM_ID, SystemError } from '@constants';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextService: ContextService) {}

  use(req: Request, _: Response, next: NextFunction) {
    const teamId = req.headers[HEADER_TEAM_ID] as string;

    if (!teamId || isNaN(Number(teamId))) {
      throw new BadRequestException(SystemError.REQUIRED__HEADER_TEAM_ID);
    }
    this.contextService.runContext(new Map(), () => {
      this.contextService.setData('requestId', req.requestId!);
      this.contextService.setData('tenantId', Number(teamId));
      this.contextService.setData('userAgent', req.headers['user-agent']);
      this.contextService.setData('ipAddress', req.ip);

      next();
    });
  }
}
