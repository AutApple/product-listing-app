import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { extractRelationsFromSelect } from './utils/extract-relations.js';
import { deepMergeObjects } from './utils/deep-merge-objects.js';
import { MinimalEntity } from './entities/minimal.entity.js';

export class BaseService <Entity extends MinimalEntity> {
    constructor(
        protected readonly repository: Repository<Entity>,
        protected readonly loadRelations: boolean = true
    ) { }

    protected readonly defaultSelectOptions: FindOptionsSelect<Entity> = {}

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
        filterOptions: FindOptionsWhere<Entity> = {},
        customRelations: string[] = []
    ) : Promise <Entity[]> {
        const selectOptions = deepMergeObjects(this.defaultSelectOptions, mergeSelectOptions);
        const relations = [...customRelations, ...extractRelationsFromSelect(selectOptions)];
        const entities = await this.repository.find({ 
            order: orderOptions, 
            select: selectOptions, 
            where: filterOptions,
            relations: this.loadRelations ? relations : [],
            skip,
            take
        });
        return entities;
    }



}