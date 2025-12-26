import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity.js';
import { WishlistItemEntity } from './wishlist-item.entity.js';

@Entity({
    name: 'wishlists'
})
export class WishlistEntity extends AbstractEntity {
    @OneToOne(() => UserEntity, (u: UserEntity) => u.wishlist, {nullable: true})
    @JoinColumn()
    @Index({ unique: true })
    user: UserEntity;

    @Column({
        nullable: true,
        type: 'varchar',
        unique: true
    })
    anonymousId: string | null; 

    @OneToMany(() => WishlistItemEntity, w => w.wishlist, {
        cascade: ['insert', 'remove', 'update'],
        nullable: true
    }) 
    items: WishlistItemEntity[];

    @Index(['expires_at'])
    @Column({ type: 'timestamptz', nullable: true, name: 'expires_at' }) 
    expiresAt: Date; // this column is used for cleaning up userless wishlists 
}
