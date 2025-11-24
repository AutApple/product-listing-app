import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import defaultValidationConfig from '../../config/validation.config.js';
import { Column, Entity, } from 'typeorm';

@Entity({
    name: 'products'
})
export class ProductEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxSlugLength,
        unique: true
    })
    slug: string

    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxTitleLength
    })
    title: string

    @Column({
        name: 'short_description',
        default: 'No description specified.',
        type: 'varchar',
        length: defaultValidationConfig.product.maxShortDescriptionLength
    })
    shortDescription: string

    @Column({ 
        default: 'No description specified.',
        type: 'varchar',
        length: defaultValidationConfig.product.maxDescriptionLength
    })
    description: string


}
