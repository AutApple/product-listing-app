import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    email: string;
    @IsString()
    name: string;
    @IsString()
    hashedPassword: string; 
}
