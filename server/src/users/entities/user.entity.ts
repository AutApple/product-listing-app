import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity } from 'typeorm';

@Entity({
    name: 'users'
})
export class UserEntity extends AbstractEntity{
    @Column({
        unique: true
    })
    email: string;
    
    @Column()
    name: string; 

    @Column({
        name: 'hashed_pwd',
        select: false, 
        length: 100
    })
    hashedPassword: string;

    @Column({
        name: 'is_admin',
        type: 'boolean',
        default: false
    })
    isAdmin: boolean;
}
