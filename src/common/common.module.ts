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
import { MulterService } from './storage/multer.service';
import { StorageProvider } from './storage/storage.provider';
import { LocalStorageService } from './storage/vendors/local.service';
import { CloudflareR2Service } from './storage/vendors/cloudflare-r2.service';

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
    StorageProvider,
    LocalStorageService,
    CloudflareR2Service,
  ],
  exports: [
    PrismaService,
    ValidationService,
    MailService,
    HashidService,
    MulterService,
    StorageProvider,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
