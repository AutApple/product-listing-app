import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { defaultValidationConfig } from '../../config/validation.config.js';

export class ChangeEmailDto {
    @IsString()    
    @ApiProperty({
        name: 'password',
        type: 'string',
        description: 'Current password'
    })
    password: string; 
    
    @ApiProperty({
        name: 'newEmail',
        type: 'string',
        description: 'New email'
    })
    @IsString()
    @IsEmail()
    @Length(defaultValidationConfig.auth.minEmailLength, defaultValidationConfig.auth.maxEmailLength)
    newEmail: string;
     
}