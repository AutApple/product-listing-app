import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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
    newEmail: string;
     
}