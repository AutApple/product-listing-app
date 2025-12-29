import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {  CreateCategoryDto, UpdateCategoryDto, OutputCategoryDto, CategoryEntity  } from './';
import { ParsedQuery, type QueryParserResult } from '../query-parser/';
import { globalQueryParserConfig } from '../config/';
import { QueryCommonDto, toOutputDto, BulkOrSingleValidationPipe } from '../common/';
import { AccessTokenGuard, AdminGuard } from '../auth/';
import { ApiCommonFindManyResources, ApiCommonFindOneResource, ApiCommonCreateResource, ApiCommonUpdateResource, ApiCommonDeleteResource } from '../swagger/';
import { CategoriesService } from './categories.service.js';
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
  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateCategoryDto)) createCategoryDto: CreateCategoryDto | CreateCategoryDto[]) {
    const data = await this.categoriesService.create(createCategoryDto);
    return this.dto(data);
  }

  @ApiCommonUpdateResource('category', CreateCategoryDto, OutputCategoryDto)
  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const data = await this.categoriesService.update(slug, updateCategoryDto);
    return this.dto(data);
  }

  @ApiCommonDeleteResource('category', OutputCategoryDto)
  @UseGuards(AccessTokenGuard, AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.categoriesService.remove(slug);
    return this.dto(data);
  }
}
