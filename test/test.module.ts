import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { HashidService } from '../src/common/helper/hashid.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TestService, HashidService],
})
export class TestModule {}
