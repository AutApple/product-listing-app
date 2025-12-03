import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { extractRelationsFromSelect } from '../query-parser/decorators/extract-relations.js';
import { deepMergeObjects } from './utils/deep-merge-objects.js';
import { NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';

type MinimalEntity = {
    id: number | string;
    slug: string;
}

interface DTOConstructorShape<Entity, DTOClass> {
    new(entity: Entity) : DTOClass;
}


export class BaseService <Entity extends MinimalEntity, OutputDTO> {
    constructor(
        private readonly repository: Repository<Entity>,
        private readonly dtoClass: DTOConstructorShape<Entity, OutputDTO>,
        private readonly resourceName: string = 'resource'
    ) { }

    protected readonly defaultSelectOptions = {}

    /**
     * @description Service method used to retrieve multiple resources. 
     * @async
     * @param {FindOptionsSelect<Entity>} [mergeSelectOptions={}] What specific fields should be retrieved besides the ones that are specified in default configuration
     * @param {FindOptionsOrder<Entity>} [orderOptions={}] - Ordering options 
     * @param {number} [skip=0] - Offset
     * @param {number} [take=10] - How much resources to take
     * @returns {Promise<OutputDTO[]>} - a promise that resolves to an array of DTOs resembling resource fields
     */
    async findAll(
        mergeSelectOptions: FindOptionsSelect<Entity> = {},
        orderOptions: FindOptionsOrder<Entity> = {},
        skip: number = 0,
        take: number = 10,
        filterOptions: FindOptionsWhere<Entity> = {}
    ) : Promise <OutputDTO[]> {
        const selectOptions = deepMergeObjects(this.defaultSelectOptions, mergeSelectOptions);
        const relations = extractRelationsFromSelect(selectOptions);
        const entities = await this.repository.find({ 
            order: orderOptions, 
            select: selectOptions, 
            where: filterOptions,
            relations,
            skip,
            take
        });
        return entities.map(e => new this.dtoClass(e));
    }

    /**
     * @description Service method used to retrieve specific resource by it's slug. 
     * @async
     * @param {string} slug - Slug of a resource
     * @param {FindOptionsSelect<Entity>} [mergeSelectOptions={}] - what specific fields should be retrieved besides the ones that are specified in default configuration
     * @throws {NotFoundException} - if no resouce was found with given slug.
     * @returns {Promise<Entity>} - a promise that resolves to a specific TypeORM entity with a given slug
     */
    async findOneBySlug(
        slug: string, 
        mergeSelectOptions: FindOptionsSelect<Entity> = {}
    ): Promise<Entity> {
        const selectOptions = deepMergeObjects(this.defaultSelectOptions, mergeSelectOptions);
        const relations = extractRelationsFromSelect(selectOptions);
     
        const entity = await this.repository.findOne({
          where: {slug} as FindOptionsWhere<Entity>, 
          select: selectOptions, 
          relations
        });
    
        if(!entity)
          throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND(this.resourceName, slug));
        return entity;
    }

    /**
     * @description Service method used to retrieve specific resource by it's slug and return it in form of desired output DTO. 
     * @async
     * @param {string} slug - Slug of a resource
     * @param {FindOptionsSelect<Entity>} [mergeSelectOptions={}] - what specific fields should be retrieved besides the ones that are specified in default configuration
     * @throws {NotFoundException} - if no resouce was found with given slug.
     * @returns {Promise<Entity>} - a promise that resolves to a resource data in a format of output DTO
     */
    async findOneBySlugDTO(slug: string,  mergeSelectOptions: FindOptionsSelect<Entity> = {}): Promise<OutputDTO> {
        return new this.dtoClass(await this.findOneBySlug(slug, mergeSelectOptions));
    }
    

    /**
     * @description Service method used to remove specific resource by it's slug. 
     * @async
     * @param {string} slug - Slug of a resource
     * @param {FindOptionsSelect<Entity>} [mergeSelectOptions={}] - what specific fields should be retrieved besides the ones that are specified in default configuration
     * @throws {NotFoundException} - if no resouce was found with given slug.
     * @returns {Promise<Entity>} - a promise that resolves to a resource data in a format of output DTO
     */
    async remove(slug: string): Promise<OutputDTO> {
        const entity = await this.findOneBySlug(slug);
        await this.repository.remove(entity);
        return new this.dtoClass(entity);
    }


}