import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudflareR2Service } from './vendors/cloudflare-r2.service';
import { LocalStorageService } from './vendors/local.service';

export const StorageProvider: Provider = {
  provide: 'StorageService',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const storageType = configService.get<string>('STORAGE', 'local');
    if (storageType === 'r2') {
      return new CloudflareR2Service(configService);
    }
    return new LocalStorageService(configService);
  },
};
