import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
    @ApiProperty({
        name: 'name',
        description: 'New user name'
    })
    @IsString()
    @IsOptional()
    name?: string;
}
