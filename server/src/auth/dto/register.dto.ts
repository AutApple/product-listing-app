import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        name: 'email',
        type: 'string',
        description: 'Email for a new user'
    })
    @IsString()
    @IsEmail()
    email: string; 

    @ApiProperty({
        name: 'name',
        type: 'string',
        description: 'Display name for a new user'
    })
    @IsString()
    name: string;

    @ApiProperty({
        name: 'password',
        type: 'string',
        description: 'Password for a new user'
    })
    @IsString() 
    password: string;
    
    @ApiProperty({
        name: 'confirmPassword',
        type: 'string',
        description: 'Password confirmation field'
    })
    @IsString()
    confirmPassword: string; 
}