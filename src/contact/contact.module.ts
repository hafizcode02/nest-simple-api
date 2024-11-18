import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MulterService } from 'src/common/multer.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, MulterService],
})
export class ContactModule {}
