import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Validate required environment variables
    if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
      throw new Error(
        'MAIL_USER and MAIL_PASSWORD environment variables are required',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.log(
        `Email sent successfully to ${options.to}: ${info.messageId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendInviteEmail(
    to: string,
    inviterEmail: string,
    teamName: string,
    inviteLink: string,
  ): Promise<boolean> {
    const subject = `You've been invited to join ${teamName}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #4CAF50; 
              color: white; 
              text-decoration: none; 
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Team Invitation</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p><strong>${inviterEmail}</strong> has invited you to join the team <strong>${teamName}</strong>.</p>
              <p>Click the button below to accept the invitation:</p>
              <p style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept Invitation</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${inviteLink}</p>
              <p><strong>Note:</strong> This invitation link will expire in 7 days.</p>
            </div>
            <div class="footer">
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const text = `
You've been invited to join ${teamName}

${inviterEmail} has invited you to join their team.

Click the link below to accept the invitation:
${inviteLink}

This invitation link will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
    `;

    return this.sendMail({ to, subject, html, text });
  }
}
