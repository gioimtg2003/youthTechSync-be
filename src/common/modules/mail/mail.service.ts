import { USER_EMAIL } from '@constants';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async send(options?: {
    /**
     * Email sender address
     * @type {string}
     * @default USER_EMAIL.NO_REPLY
     */
    from?: string;
    to: string;
    cc?: any[];
    subject: string;
    template: string;
    context: any;
  }) {
    const {
      to,
      cc,
      subject,
      template,
      from = USER_EMAIL.NO_REPLY,
    } = options ?? {};

    const sendFrom = `${from}@${this.configService.get('EMAIL_DOMAIN')}`;
    console.log('🚀 ~ MailService ~ send ~ sendFrom:', sendFrom);
    await this.mailerService.sendMail({
      from: sendFrom,
      to,
      cc,
      subject,
      template,
      context: {
        ...options.context,
      },
    });
  }
}
