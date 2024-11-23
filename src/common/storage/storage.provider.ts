import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudflareR2Service } from './vendors/cloudflare-r2.service';
import { LocalStorageService } from './vendors/local.service';
import { AwsS3Service } from './vendors/aws-s3.service';
import { GoogleCloudStorageService } from './vendors/gcp-bucket.service';

export const StorageProvider: Provider = {
  provide: 'StorageService',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const storageType = configService.get<string>('STORAGE', 'local');
    if (storageType === 'r2') {
      return new CloudflareR2Service(configService);
    } else if (storageType === 's3') {
      return new AwsS3Service(configService);
    } else if (storageType === 'gcp') {
      return new GoogleCloudStorageService(configService);
    }
    return new LocalStorageService(configService);
  },
};
