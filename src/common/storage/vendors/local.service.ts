import { ConfigService } from '@nestjs/config';
import { renameBaseFile } from '../file.util';
import { StorageService } from '../storage.service';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStorageService implements StorageService {
  constructor(private readonly configService: ConfigService) {}
  async saveFile(file: Express.Multer.File): Promise<string> {
    const newFileName = renameBaseFile(file.originalname);
    const uploadDir = join(
      process.cwd(),
      this.configService.get<string>('UPLOAD_DIR', 'uploads'),
    );
    const uploadPath = join(uploadDir, newFileName);

    const fs = await import('fs/promises');
    await fs.mkdir(uploadDir, { recursive: true });

    writeFileSync(uploadPath, file.buffer);
    return newFileName;
  }
}
