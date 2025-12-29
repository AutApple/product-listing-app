import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

export async function getReddisConfig(configService: ConfigService): Promise<CacheModuleOptions> {
    return {
            store: redisStore,
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
            ttl: configService.get<number>('REDIS_TTL_TIME') || 350
          }
}