import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { defaultValidationConfig } from '../../config/validation.config.js';

export class RegisterDto {
    @ApiProperty({
        name: 'email',
        type: 'string',
        description: 'Email for a new user'
    })
    @IsString()
    @IsEmail()
    @Length(defaultValidationConfig.auth.minEmailLength, defaultValidationConfig.auth.maxEmailLength)
    email: string; 

    @ApiProperty({
        name: 'name',
        type: 'string',
        description: 'Display name for a new user'
    })
    @IsString()
    @Length(defaultValidationConfig.auth.minNameLength, defaultValidationConfig.auth.maxNameLength)
    name: string;

    @ApiProperty({
        name: 'password',
        type: 'string',
        description: 'Password for a new user'
    })
    @IsString()
    @IsStrongPassword(defaultValidationConfig.auth.isStrongPasswordOptions)
    password: string;
    
    @ApiProperty({
        name: 'confirmPassword',
        type: 'string',
        description: 'Password confirmation field'
    })
    @IsString()
    confirmPassword: string; 
}