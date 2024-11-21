import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './helper/prisma.service';
import { ValidationService } from './helper/validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionService } from './helper/exception.service';
import { MailService } from './mail/mail.service';
import { HashidService } from './helper/hashid.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { MulterService } from './multer/multer.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.printf(({ level, message, timestamp, ms }) => {
              return `${timestamp} ${ms} ${level}: ${message}`;
            }),
          ),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ExceptionService,
    },
    MailService,
    HashidService,
    MulterService,
  ],
  exports: [
    PrismaService,
    ValidationService,
    MailService,
    HashidService,
    MulterService,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
