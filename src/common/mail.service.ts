import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailSubjectList, MailTemplate } from './mail.template';
import { ConfigService } from '@nestjs/config';
import { MailServiceException } from './exception.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    } as SMTPTransport.Options);
  }

  async sendWelcomeEmail(name: string, recipientEmail: string) {
    const subject = MailSubjectList.WELCOME;
    const html = MailTemplate.welcomeEmail(name);

    const info = await this.sendMail(recipientEmail, subject, html);
    return info.messageId;
  }

  async sendVerificationEmail(
    name: string,
    recipientEmail: string,
    verifyEmailLink: string,
  ) {
    const subject = MailSubjectList.VERIFY;
    const html = MailTemplate.verifyEmail(name, verifyEmailLink);

    const info = await this.sendMail(recipientEmail, subject, html);
    return info.messageId;
  }

  private async sendMail(to: string, subject: string, html?: string) {
    const mailOptions = {
      from: this.configService.get('MAIL_USER'),
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      this.logger.log(`SMTP Response: ${JSON.stringify(info)}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new MailServiceException(`Failed to send email: ${error.message}`);
    }
  }
}
