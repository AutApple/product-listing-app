import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AttributeEntity } from '../../attributes/entities/attribute.entity.js';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { ProductEntity } from '../../products/entities/product.entity.js';

@Entity({
    name: 'product_types'
})
export class ProductTypeEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: 255,
    })
    @Index({ unique: true })
    slug: string;

    @OneToMany(() => ProductEntity, (product) => product.productType)
    products: ProductEntity[];

    @ManyToMany(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.productTypes, { onDelete: 'CASCADE' })
    @JoinTable()
    attributes: AttributeEntity[];
}
