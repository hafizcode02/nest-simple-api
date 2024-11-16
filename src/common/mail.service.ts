import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailSubjectList, MailTemplate } from './mail.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    } as SMTPTransport.Options);
  }

  async sendWelcomeEmail(name: string, recipientEmail: string) {
    const subject = MailSubjectList.WELCOME;
    const html = MailTemplate.welcomeEmail(name);

    await this.sendMail(recipientEmail, subject, html);
  }

  async sendVerificationEmail(
    name: string,
    recipientEmail: string,
    verifyEmailLink: string,
  ) {
    const subject = MailSubjectList.VERIFY;
    const html = MailTemplate.verifyEmail(name, verifyEmailLink);

    await this.sendMail(recipientEmail, subject, html);
  }

  private async sendMail(to: string, subject: string, html?: string) {
    const mailOptions = {
      from: process.env.MAIL_USER,
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
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
