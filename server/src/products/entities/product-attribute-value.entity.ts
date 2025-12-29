import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AttributeEntity } from '../../attributes/entities/attribute.entity.js';
import { ProductEntity } from './product.entity.js';

@Entity({
    name: 'product_attribute_values'
})
export class ProductAttributeValueEntity {
    @PrimaryColumn({ name: 'product_id', type: 'uuid' })
    productId: string;

    @PrimaryColumn({ name: 'attribute_id', type: 'uuid' })
    attributeId: string;

    @ManyToOne(() => ProductEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @ManyToOne(() => AttributeEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'attribute_id' })
    attribute: AttributeEntity;

    // there should be only one of these set
    @Column({ type: 'varchar', length: 255, nullable: true })
    valueString: string | null;

    @Column({ type: 'numeric', nullable: true })
    valueInt: number | null;

    @Column({ type: 'boolean', nullable: true })
    valueBool: boolean | null;
}