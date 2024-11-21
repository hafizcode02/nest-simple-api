import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MulterService } from '../common/multer/multer.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, MulterService],
})
export class ContactModule {}
