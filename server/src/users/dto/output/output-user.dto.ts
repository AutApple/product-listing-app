import { UserEntity } from '../../entities/user.entity.js';

export class OutputUserDto {
    email: string; 
    name: string;
    isAdmin: boolean;
    
    constructor (user: UserEntity) {
        this.email = user.email; 
        this.name = user.name; 
        this.isAdmin = user.isAdmin;
    }
}