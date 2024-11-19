import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ContactModule } from './contact/contact.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          limit: 100,
          ttl: 60000,
        },
      ],
    }),
    CommonModule,
    UserModule,
    ContactModule,
    AddressModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
