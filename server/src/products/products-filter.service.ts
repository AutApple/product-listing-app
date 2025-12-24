import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterEntry, attributeTypeToFieldType, FilterConditionBuilder } from '../common/';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { And, FindOperator, FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttributeValueEntity, ProductEntity, ProductView } from './';
import { FieldType } from '../query-parser/';
import { AttributeTypes, AttributeEntity } from '../attributes/';
import { CategoriesService } from '../categories/categories.service.js';



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
            return {};

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

    public async createAttributeFilters(
        filterCollection: Record<string, FilterEntry[]>
    ): Promise<FindOptionsWhere<ProductView>> {
        // TODO: MAYBE rework whole filtering (common as well) logic to use qb. at least something to consider
        const qb = this.productRepository.createQueryBuilder('p');

        const dict = {
            [FieldType.NUMBER]: 'valueInt',
            [FieldType.STRING]: 'valueString',
            [FieldType.BOOLEAN]: 'valueBool'
        };

        const filterConditionBuilder = new FilterConditionBuilder();

        let i = 0;

        for (const slug of Object.keys(filterCollection)) {
            const attribute = await this.attributeRepository.findOne({
                where: { slug }
            });

            if (!attribute)
                throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND(slug));

            const type = attributeTypeToFieldType(attribute.type as AttributeTypes);
            const field = dict[type];

            const filters = filterCollection[slug];

            // For each filter slug, value and operator construct SELECT p.id WHERE EXISTS (1st attribute value matching corresponding filter conditions) AND WHERE EXISTS(2nd attr val..) ...
            qb.andWhere(qb2 => {
                // It's going to check whether each individual attribute with specified filter exist on the product using EXISTS.
                const subQuery = qb2
                    .subQuery()
                    .select('1') // EXISTS doesn't care about amount or specific columns. all it checks is whether that SELECT statement retrieves at least one row. 
                    .from(ProductAttributeValueEntity, 'av')
                    .innerJoin('av.attribute', 'a')
                    .where('av.productId = p.id')
                    .andWhere(`a.slug = :slug_${i}`); // first WHERE on attribute value will check whether slug of an attribute matches the one in the filter 
                // now for each filter (in case if there is multiple filters on the same slug, like filter_gt[weight] = 20 & filter_lt[weight] = 40)
                filters.forEach((f, j) => {
                    const op = filterConditionBuilder.buildFindOperator(f, type); // FIXME: very messy. add separate buildSQLFindOperator into the filter condition builder / consider making cleaner architecture
                    subQuery.andWhere(`av.${field} ${this.operatorToSql(op, i, j)}`); // make filter for an attribute value
                    qb.setParameter(`v_${i}_${j}`, op.value); 
                });

                qb.setParameter(`slug_${i}`, slug); // add slug to the parameters

                return `EXISTS ${subQuery.getQuery()}`; // return EXISTS with constructed query
            });

            i++; 
        }

        const ids = await qb.select('p.id').getMany();
        return { id: In(ids.map(v => v.id)) };
    }

    private operatorToSql(
        op: FindOperator<any>,
        i: number,
        j: number
    ): string {
        switch (op.type) {
            case 'equal':
                return `= :v_${i}_${j}`;
            case 'lessThan':
                return `< :v_${i}_${j}`;
            case 'lessThanOrEqual':
                return `<= :v_${i}_${j}`;
            case 'moreThan':
                return `> :v_${i}_${j}`;
            case 'moreThanOrEqual':
                return `>= :v_${i}_${j}`;
            case 'like':
                return `LIKE :v_${i}_${j}`;
            case 'in':
                return `IN (:...v_${i}_${j})`;
            default:
                throw new Error(`Unsupported operator: ${op.type}`);
        }
    }
}