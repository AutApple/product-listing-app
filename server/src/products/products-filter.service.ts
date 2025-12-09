import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service.js';
import { FilterEntry } from '../common/dto/query.common.dto.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';


@Injectable()

export class ProductsFilterService {
    constructor(
        private readonly categoriesService: CategoriesService,
        @InjectRepository(AttributeEntity) private readonly attributeRepository: Repository<AttributeEntity>
    ) {}

    public async createCategoryFilters(entries: FilterEntry[]): Promise<object> {
        const categorySlugs: string[] = [];        
        for (const entry of entries) {
            if (entry.operation !== 'eq')
                throw new BadRequestException(ERROR_MESSAGES.FILTER_WRONG_SIGNATURE('category'));
            for (const value of entry.values)
                categorySlugs.push(... await this.categoriesService.getFlattenedCategoryTree(value)); // search within specified categories and their children
        }
        return {category: {slug: In(categorySlugs)}};
    }

    public async createAttributeFilters (filterCollection: Record<string, FilterEntry[]>) {

    }
}