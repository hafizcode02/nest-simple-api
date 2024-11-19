import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class MulterService {
  constructor() {}

  saveFile(file: Express.Multer.File): string {
    join(__dirname, '../../uploads', file.filename);
    return file.filename;
  }
}
