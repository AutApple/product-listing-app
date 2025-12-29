import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { ProductEntity } from '../../products/entities/product.entity.js';
@Entity({
    name: 'categories'
})
export class CategoryEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: 255,
    })
    @Index({ unique: true })
    slug: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    title: string;

    @ManyToOne(() => CategoryEntity, (category: CategoryEntity) => category.childrenCategories, { nullable: true })
    parentCategory: CategoryEntity;

    @OneToMany(() => CategoryEntity, (category: CategoryEntity) => category.parentCategory)
    childrenCategories: CategoryEntity[];

    @OneToMany(() => ProductEntity, (product: ProductEntity) => product.category)
    products: ProductEntity[];
}