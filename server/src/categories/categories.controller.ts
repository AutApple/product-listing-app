import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { BulkOrSingleValidationPipe } from '../common/pipes/bulk-or-single-validation.pipe.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputCategoryDTO as OutputCategoryDto } from './dto/output/output-category.dto.js';
import { CategoryEntity } from './entities/category.entity.js';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { ApiCommonFindManyResources, ApiCommonFindOneResource } from '../swagger/decorators/common-find.decorator.js';
import { ApiCommonCreateResource } from '../swagger/decorators/common-create.decorator.js';
import { ApiCommonUpdateResource } from '../swagger/decorators/common-update.decorator.js';
import { ApiCommonDeleteResource } from '../swagger/decorators/common-delete.decorator.js';

@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  
  private dto(e: CategoryEntity | CategoryEntity[]): OutputCategoryDto | OutputCategoryDto[] {
    return toOutputDto(e, OutputCategoryDto);
  }

  @ApiCommonFindManyResources('category', OutputCategoryDto)
  @Get()
  async findAll(@ParsedQuery({config: globalQueryParserConfig.categories, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    const data = await this.categoriesService.findAll(
        parsedQuery.selectOptions ?? {}, 
        parsedQuery.orderOptions ?? {}, 
        parsedQuery.paginationOptions?.skip ?? 0, //TODO: default pagination options config.
        parsedQuery.paginationOptions?.take ?? 10,
        parsedQuery.filterOptions ?? {}
    );
    return this.dto(data);
  }

  @ApiCommonFindOneResource('category', OutputCategoryDto)
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.categories, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    const data = await this.categoriesService.findOneBySlug(slug, parsedQuery.selectOptions ?? {});
    return this.dto(data);
  }

  @ApiCommonCreateResource('category', CreateCategoryDto, OutputCategoryDto)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateCategoryDto)) createCategoryDto: CreateCategoryDto | CreateCategoryDto[]) {
    const data = await this.categoriesService.create(createCategoryDto);
    return this.dto(data);
  }

  @ApiCommonUpdateResource('category', CreateCategoryDto, OutputCategoryDto)
  @UseGuards(AdminGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const data = await this.categoriesService.update(slug, updateCategoryDto);
    return this.dto(data);
  }

  @ApiCommonDeleteResource('category', OutputCategoryDto)
  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.categoriesService.remove(slug);
    return this.dto(data);
  }
}
