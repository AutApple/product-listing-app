import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadImageDto {
    @ApiProperty({
        description: 'Image slug to reference it'
    })
    @IsString()
    slug: string;

    @ApiProperty({ description: 'Attached image file', type: 'string', format: 'binary' })
    file: any;
}
