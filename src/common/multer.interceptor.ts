import { BadRequestException, Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Injectable()
export class MulterInterceptor {
  static create(options: {
    fieldName: string;
    fileTypes: string[];
    maxSize: number;
  }) {
    return FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../uploads'),
        filename: (req, file, callback) => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replace invalid characters for file names
          const ext = file.originalname.split('.').pop(); // Extract file extension
          const newFileName = `${timestamp}.${ext}`; // Save as timestamp.ext
          callback(null, newFileName);
        },
      }),
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
