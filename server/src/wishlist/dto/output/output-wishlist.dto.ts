import { WishlistEntity } from '../../entities/wishlist.entity.js';
import { WishlistItem } from '../../types/wishlist-item.type.js';

export class OutputWishlistDto {
    items: WishlistItem[];
    constructor (entity: WishlistEntity) {
        this.items = [];
        
        if (!entity.items)
            return;

        for (const item of entity.items)
            this.items.push({amount: item.amount, slug: item.product.slug});
    }
}