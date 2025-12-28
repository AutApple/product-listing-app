import { IsOptional, IsString } from 'class-validator';

export class UpdateUserCredentialsDto {
    @IsString()
    @IsOptional()
    email?: string;
    @IsString()
    @IsOptional()
    password?: string;
}
