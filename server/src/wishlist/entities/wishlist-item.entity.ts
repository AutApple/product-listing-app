import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { WishlistEntity } from './wishlist.entity.js';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { ProductEntity } from '../../products/entities/product.entity.js';

@Entity({
    name: 'wishlist_items'
})
export class WishlistItemEntity extends AbstractEntity {
    @ManyToOne(() => WishlistEntity, w => w.items) 
    wishlist: WishlistEntity;

    @ManyToOne(() => ProductEntity, p => p.wishlistItems)
    product: ProductEntity;

    @Column({
        type: 'numeric',
        default: 1
    })
    amount: number; 
}