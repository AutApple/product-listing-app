import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  get(): string {
    return 'redirect to docs';
  }
}
