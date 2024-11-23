import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { renameBaseFile } from '../file.util';
import { StorageService } from '../storage.service';

@Injectable()
export class GoogleCloudStorageService implements StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCP_PROJECT_ID'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'), // Path to your service account key file
    });
    this.bucketName = this.configService.get<string>('GCP_BUCKET_NAME');
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const newFileName = renameBaseFile(file.originalname); // Rename file
    const bucket = this.storage.bucket(this.bucketName);
    const fileUpload = bucket.file(newFileName);

    try {
      await fileUpload.save(file.buffer, {
        contentType: file.mimetype,
      });
      return `https://storage.googleapis.com/${this.bucketName}/${newFileName}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}
