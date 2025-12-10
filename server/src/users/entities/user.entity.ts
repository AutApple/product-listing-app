import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity } from 'typeorm';

@Entity({
    name: 'users'
})
export class User extends AbstractEntity{
    @Column()
    email: string;
    @Column()
    name: string; 
    @Column({
        name: 'hashed_pwd'
    })
    hashedPwd: string;
}
