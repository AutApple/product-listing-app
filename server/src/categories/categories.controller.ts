import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { BulkOrSingleValidationPipe } from '../common/pipes/bulk-or-single-validation.pipe.js';

@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body(new BulkOrSingleValidationPipe(CreateCategoryDto)) createCategoryDto: CreateCategoryDto | CreateCategoryDto[]) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@ParsedQuery({config: globalQueryParserConfig.categories, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    return this.categoriesService.findAll(
        parsedQuery.selectOptions ?? {}, 
        parsedQuery.orderOptions ?? {}, 
        parsedQuery.paginationOptions?.skip ?? 0, //TODO: default pagination options config.
        parsedQuery.paginationOptions?.take ?? 10,
        parsedQuery.filterOptions ?? {}
    );
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.categories, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    return this.categoriesService.findOneBySlug(slug, parsedQuery.selectOptions ?? {});
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(slug, updateCategoryDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.categoriesService.remove(slug);
  }
}
