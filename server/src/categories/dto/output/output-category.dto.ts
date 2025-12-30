import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { CategoryEntity } from '../../entities/category.entity.js';

export class OutputCategoryDto {
    @ApiProperty({
        type: 'string',
        name: 'slug',
        description: 'Slug of a category'
    })
    slug: string; 
    
    @ApiProperty({
        type: 'string',
        name: 'slug',
        description: 'Title of a category'
    })
    title: string; 
    
    @ApiProperty({
        name: 'path',
        description: 'Path to the category',
        oneOf: [{
            type: 'string',
            description: 'Full slash separated path to the category'
        }, {
            type: 'array',
            items: {type: 'string'},
            description: 'Individual category slugs that make up a path'
        }]
    })
    path: string[] | string;

    constructor (entity: CategoryEntity, stringPath: boolean = true, useTitlePath: boolean = true) {
        let currentEntity = entity;

        const tempPath: string[] = [];
        while (currentEntity) {

            tempPath.unshift(useTitlePath? currentEntity.title : currentEntity.slug);
            currentEntity = currentEntity.parentCategory;
        }
        this.path = stringPath ? tempPath.join('/') : tempPath;
        this.slug = entity.slug;
        this.title = entity.title;
    }
}