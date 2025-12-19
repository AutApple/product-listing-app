import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from './base.service.js';
import { MinimalEntity } from './entities/minimal.entity.js';
import { deepMergeObjects } from './utils/deep-merge-objects.js';
import { extractRelationsFromSelect } from './utils/extract-relations.js';
import { NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';


export abstract class IdResourceService<
    Entity extends MinimalEntity
> extends BaseService<Entity> {
    protected constructor(
        protected readonly repository: Repository<Entity>,
        protected readonly resourceName: string,
        protected readonly loadRelations: boolean = true
    ) {
        super(repository, loadRelations);
    }

    /**
     * @description Service method used to retrieve specific resource by it's id. 
     * @async
     * @param {string} id - id of a resource
     * @param {FindOptionsSelect<Entity>} [mergeSelectOptions={}] - what specific fields should be retrieved besides the ones that are specified in default configuration
     * @throws {NotFoundException} - if no resouce was found with given id.
     * @returns {Promise<Entity>} - a promise that resolves to a specific TypeORM entity with a given id
     */
    async findOneById(
        id: string,
        mergeSelectOptions: FindOptionsSelect<Entity> = {},
        customRelations: string[] = []
    ): Promise<Entity> {
        const selectOptions = deepMergeObjects(this.defaultSelectOptions, mergeSelectOptions);
        const relations = [...customRelations, ...extractRelationsFromSelect(selectOptions)];
        const entity = await this.repository.findOne({
            where: { id } as FindOptionsWhere<Entity>,
            select: selectOptions,
            relations: this.loadRelations ? relations : []
        });

        if (!entity)
            throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND(this.resourceName, id, 'id'));
        return entity;
    }


    /**
     * @description Service method used to remove specific resource by it's id. 
     * @async
     * @param {string} id - id of a resource
     * @param {FindOptionsSelect<Entity>} [mergeSelectOptions={}] - what specific fields should be retrieved besides the ones that are specified in default configuration
     * @throws {NotFoundException} - if no resouce was found with given id.
     * @returns {Promise<Entity>} - a promise that resolves to a resource data in a format of output DTO
     */
    async remove(id: string): Promise<Entity> {
        const entity = await this.findOneById(id);
        await this.repository.remove(entity);
        return entity;
    }
}