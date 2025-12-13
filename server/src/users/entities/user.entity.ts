import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity, OneToOne } from 'typeorm';
import bcrypt from 'bcrypt';
import { WishlistEntity } from '../../wishlist/entities/wishlist.entity.js';

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
        length: 100,
        type: 'varchar'
    })
    hashedPassword: string;

    @Column({
        name: 'hashed_rt',
        length: 100,
        nullable: true,
        type: 'varchar'
    })
    hashedRefreshToken: string | null;

    @Column({
        name: 'is_admin',
        type: 'boolean',
        default: false
    })
    isAdmin: boolean;

    @OneToOne(() => WishlistEntity, (w: WishlistEntity) => w.user)
    wishlist: WishlistEntity;

    async matchesPassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.hashedPassword);
    }

    async hasValidRefreshToken(token: string): Promise<boolean> {
        if (!this.hashedRefreshToken) return false;
        return bcrypt.compare(token, this.hashedRefreshToken);
    }
}
