import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthCredentialsDto {
    @ApiProperty({
        name: 'email',
        type: 'string',
        description: 'Email of a user'
    })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        name: 'password',
        type: 'string',
        description: 'Password of a user'
    })
    @IsString()
    password: string;
}
