import { CryptoService } from '@features/crypto';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UseInvitePublicGuard implements CanActivate {
  private readonly logger = new Logger(UseInvitePublicGuard.name);

  constructor(private readonly cryptoService: CryptoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const hash = request?.query?.signature as string;
    const requestTime = request?.query?.time as string;
    const inviter = parseInt(request?.query?.inviter as string, 10);
    const inviteToken = request?.params?.inviteToken as string;

    if (!hash || !requestTime || !inviter || !inviteToken) {
      this.logger.error('No signature provided in request query');
      throw new BadRequestException('Unauthorized');
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - parseInt(requestTime, 10);
    const maxAllowedTime = 1000 * 60 * 60 * 24 * 24; // 24 days

    if (timeDiff > maxAllowedTime) {
      this.logger.error('Request time is too old');
      throw new BadRequestException('Unauthorized');
    }

    const dataToHash = `${process.env.SECRET_GENERATE_PUBLIC_INVITE}:${inviter}:${requestTime}:${inviteToken}`;

    const compare = await this.cryptoService.compareHash256(dataToHash, hash);

    if (!compare) {
      this.logger.error('Invalid signature hash');
      throw new BadRequestException('Unauthorized');
    }

    return true;
  }
}
