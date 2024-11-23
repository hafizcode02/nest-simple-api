import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { renameBaseFile } from '../file.util';

@Injectable()
export class CloudflareR2Service implements StorageService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>(
          'CLOUDFLARE_R2_SECRET_KEY',
        ),
      },
    });
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const newFileName = renameBaseFile(file.originalname); // Rename file
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: newFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return `${this.configService.get<string>('CLOUDFLARE_R2_DEV_URL')}/${newFileName}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}
