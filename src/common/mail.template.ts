export const MailSubjectList = {
  WELCOME: 'Welcome to Nest Simple API',
  VERIFY: 'Verify Email before Continue',
} as const;

export class MailTemplate {
  static welcomeEmail(name: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Welcome Email</title>
        </head>
        <body>
          <h3>Welcome, ${name}!</h3>
          <p>Thank you for joining Nest Simple API.</p>
        </body>
        </html>
      `;
  }

  static verifyEmail(name: string, verifyEmailLink: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verify Email</title>
        </head>
        <body>
          <h3>Hi ${name}.</h3>
          <p>Before getting started to use application, please verify your email first with button below:</p>
          <a href="${verifyEmailLink}">Verify Email</a>
        </body>
        </html>
      `;
  }
}
