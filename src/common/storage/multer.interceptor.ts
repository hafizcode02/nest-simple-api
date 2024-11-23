import { BadRequestException, Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Injectable()
export class MulterInterceptor {
  static create(options: {
    fieldName: string;
    fileTypes: string[];
    maxSize: number;
  }) {
    return FileInterceptor(options.fieldName, {
      storage: memoryStorage(),
      limits: {
        fileSize: options.maxSize,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = options.fileTypes;
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Only files of type ${allowedMimeTypes.join(', ')} are allowed!`,
            ),
            false,
          );
        }
        callback(null, true); // Accept the file
      },
    });
  }
}
