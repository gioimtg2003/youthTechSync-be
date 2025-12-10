import { NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export class RequestMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] || randomUUID();
    req.requestId = requestId as string;

    next();
  }
}
