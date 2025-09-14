import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserLocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(UserLocalAuthGuard.name);
  constructor() {
    super();
  }
}
