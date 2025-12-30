import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/index.js';
import { UserEntity } from '../../users/index.js';

@Entity({
    name: 'images'
})
export class ImageEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: 255
    })
    @Index({ unique: true })
    slug: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    filename: string;
    
    @ManyToOne(() => UserEntity, e => e.images)
    author: UserEntity;

    // TODO: replace entity-specific images (like ProductImage) with common ImageEntity and define corresponding relations 
}
