import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity.js';
import { Exclude } from 'class-transformer';

@Entity({
    name: "product_images"
}) 
export class ProductImageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text'
    })
    url: string;

    @ManyToOne(
        () => ProductEntity, 
        (product: ProductEntity) => product.images, 
        {
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    @Exclude({ toPlainOnly: true })
    product: ProductEntity;
}