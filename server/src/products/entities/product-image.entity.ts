import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity.js';

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

    @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.images)
    product: ProductEntity;
}