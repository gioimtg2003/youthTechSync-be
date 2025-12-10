import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const requestId = req?.headers['x-request-id'] || randomUUID();
    console.log('🚀 ~ RequestInterceptor ~ intercept ~ requestId:', requestId);
    req.requestId = requestId;

    return next.handle();
  }
}
