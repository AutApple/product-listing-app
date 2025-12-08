import { CategoryEntity } from '../../entities/category.entity.js';

export class OutputCategoryDTO {
    slug: string; 
    title: string; 
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