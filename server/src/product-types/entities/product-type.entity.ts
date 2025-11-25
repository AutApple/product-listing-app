import defaultValidationConfig from '../../config/validation.config.js';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity.js';

@Entity({
    name: 'product_types'
})
export class ProductTypeEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.productType.maxSlugLength
    })
    slug: string; 

    @OneToMany(() => ProductEntity, (product) => product.productType)
    products: ProductEntity[];
}
