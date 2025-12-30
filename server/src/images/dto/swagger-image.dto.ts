import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { UploadImageDto } from './upload-image.dto.js';

@ApiExtraModels(UploadImageDto)
export class SwaggerImageDto {
    @ApiProperty({ description: 'JSON string containing image metadata. Specify slug in it like {"slug": "yourSlug"}' })
    data: string; 

    @ApiProperty({ description: 'Attached image file', type: 'string', format: 'binary' })
    file: any;
}
