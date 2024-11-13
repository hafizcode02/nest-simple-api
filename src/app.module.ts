import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
