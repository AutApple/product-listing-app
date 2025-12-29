import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity.js';

export class OutputUserDto {
    @ApiProperty({
        name: 'email',
        description: 'Email of a user',
        type: 'string'
    })
    email: string;

    @ApiProperty({
        name: 'name',
        description: 'Display name of a user',
        type: 'string'
    })
    name: string;
    
    @ApiProperty({
        name: 'isAdmin',
        description: 'Flag indicating whether user is admin or not',
        type: 'boolean'
    })
    isAdmin: boolean;
    
    constructor (user: UserEntity) {
        this.email = user.email; 
        this.name = user.name; 
        this.isAdmin = user.isAdmin;
    }
}