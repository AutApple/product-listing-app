import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
    @IsString()    
    @ApiProperty({
        name: 'password',
        type: 'string',
        description: 'Current password'
    })
    currentPassword: string; 
    
    @ApiProperty({
        name: 'newPassword',
        type: 'string',
        description: 'New password'
    })
    @IsString() 
    newPassword: string;
    
    @ApiProperty({
        name: 'confirmPassword',
        type: 'string',
        description: 'Password confirmation field'
    })
    @IsString()
    confirmPassword: string; 
}