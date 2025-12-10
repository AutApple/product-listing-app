import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/*
    DotENV structure:
        DB_HOST
        DB_PORT
        DB_USER
        DB_PASSWORD
        DB_NAME
        DB_TYPE postgres | mysql
        DEV true | false
*/

export async function getTypeOrmConfig(configService: ConfigService): Promise<TypeOrmModuleOptions> {
    return {
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow<boolean>('DEV')
    };
}