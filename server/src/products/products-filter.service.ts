import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service.js';
import { FilterEntry } from '../common/dto/query.common.dto.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { And, FindOperator, FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';
import { ProductEntity } from './entities/product.entity.js';
import { attributeTypeToFieldType } from '../common/utils/attribute-to-filter-type.js';
import { FilterConditionBuilder } from '../common/utils/filter-condition-builder.js';
import { FieldType } from '../query-parser/types/query-parser-config.type.js';
import AttributeTypes from 'src/attributes/types/attribute.types.enum.js';
import { ProductView } from './views/product.view.js';


@Injectable()

export class ProductsFilterService {
    constructor(
        private readonly categoriesService: CategoriesService,
        @InjectRepository(AttributeEntity) private readonly attributeRepository: Repository<AttributeEntity>,
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>
    ) { }

    public async createCategoryFilters(filterCollection: Record<string, FilterEntry[]>): Promise<FindOptionsWhere<ProductView>> {
        const containsCategoryFilter = Object.keys(filterCollection).find(key => key === 'category');
        if (!containsCategoryFilter)
            return {}

        const entries = filterCollection['category'];
        const categorySlugs: string[] = [];
        
        for (const entry of entries) {
            if (entry.operation !== 'eq')
                throw new BadRequestException(ERROR_MESSAGES.FILTER_WRONG_SIGNATURE('category'));
            for (const value of entry.values)
                categorySlugs.push(... await this.categoriesService.getFlattenedCategoryTree(value)); // search within specified categories and their children
        }
        delete filterCollection['category'];
        return { categorySlug: In(categorySlugs) };
    }

    public async createAttributeFilters(filterCollection: Record<string, FilterEntry[]>): Promise<FindOptionsWhere<ProductView>> {
        const attrValueConditions: Array<object> = [];
        const filterConditionBuilder = new FilterConditionBuilder();
        for (const slug of Object.keys(filterCollection)) {
            const attribute = await this.attributeRepository.findOne({ where: { slug } });
            if (!attribute) throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND(slug));

            const type = attributeTypeToFieldType(attribute.type as AttributeTypes);
            let value: FindOperator<unknown>;

            if (filterCollection[slug].length === 1)
                value = filterConditionBuilder.buildFindOperator(filterCollection[slug][0], type);
            else
                value = And(...filterCollection[slug].map(v => filterConditionBuilder.buildFindOperator(v, type)));

            const dict = {
                [FieldType.NUMBER]: 'valueInt',
                [FieldType.STRING]: 'valueString',
                [FieldType.BOOLEAN]: 'valueBool'
            };

            //attributeValues: [{attribute: {slug: key}, value(Type) = value}, ...]
            attrValueConditions.push({ attribute: { slug: slug }, [dict[type]]: value });
        }

        // to prevent cutting attributes on applying where, i do this thing
        // where i just pull out set of product ids that would match the attribute filters and then pass them to the actual find. 
        // perfect fix would be using sql builder instead, but watever.
        const ids = await this.productRepository.find({ where: { attributeValues: attrValueConditions }, select: { id: true } });
        return { id: In(ids.map(v => v.id)) };
    }
}