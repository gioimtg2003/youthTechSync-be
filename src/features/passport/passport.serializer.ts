import { IUserSession } from '@interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  readonly logger = new Logger(AuthSerializer.name);

  serializeUser(user: IUserSession, done: (err: Error, user: any) => void) {
    console.log('🚀 ~ AuthSerializer ~ serializeUser ~ user:', user);
    this.logger.debug('Start serializing user');

    switch (true) {
      default:
        done(null, user);
        break;
    }
  }

  deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
    this.logger.debug('Start deserializing user');
    done(null, payload);
  }
}
