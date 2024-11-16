import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Hashids from 'hashids';

@Injectable()
export class HashidService {
  private hashids: Hashids;

  constructor(private configService: ConfigService) {
    this.hashids = new Hashids(
      this.configService.get<string>('HASHIDS_SALT') || 'def-ault',
      10,
    );
  }

  encode(content: number): string {
    return this.hashids.encode(content);
  }

  decode(hash: string): any {
    const decoded = this.hashids.decode(hash);
    return decoded.length ? decoded[0] : null;
  }
}
