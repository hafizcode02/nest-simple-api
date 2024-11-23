import { Inject, Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';

@Injectable()
export class MulterService {
  constructor(
    @Inject('StorageService') private readonly storageService: StorageService,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    return this.storageService.saveFile(file);
  }
}
