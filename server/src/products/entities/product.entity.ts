import { AbstractEntity } from '../../common/abstract.entity.js';
import defaultValidationConfig from '../../config/validation.config.js';
import { Column, Entity, } from 'typeorm';

@Entity({
    name: 'products'
})
export class ProductEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxProductSlugLength,
        unique: true
    })
    slug: string

    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxProductTitleLength
    })
    title: string

}
