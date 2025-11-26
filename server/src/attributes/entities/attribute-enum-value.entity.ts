import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AttributeEntity } from './attribute.entity.js';
import { Exclude } from 'class-transformer';

@Entity({
    name: 'attribute_enum_values'
})
export class AttributeEnumValueEntity {
    @PrimaryColumn()
    attributeId: string;

    @ManyToOne(() => AttributeEntity, (attribute: AttributeEntity) => attribute.enumValues, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'attributeId'})
    @Exclude({ toPlainOnly: true })  
    attribute: AttributeEntity;

    @Column({
        type: 'varchar',
        length: '128'
    })
    value: string;

    constructor(value: string, attribute: AttributeEntity) {
        this.value = value;
        this.attribute = attribute;
    }
}