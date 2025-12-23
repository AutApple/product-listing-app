import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParsedQuery, type QueryParserResult } from '../query-parser/';
import { globalQueryParserConfig } from '../config/';
import { BulkOrSingleValidationPipe, toOutputDto, QueryCommonDto } from '../common/';
import { ProductTypeEntity, OutputProductTypeDto, CreateProductTypeDto, UpdateProductTypeDto } from './';
import { AdminGuard } from '../auth/';
import { ApiCommonFindManyResources, ApiCommonFindOneResource, ApiCommonCreateResource,  ApiCommonUpdateResource, ApiCommonDeleteResource } from '../swagger/';
import { ProductTypesService } from './product-types.service.js';

@Controller('admin/product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) { }
  
  private dto(e: ProductTypeEntity | ProductTypeEntity[]): OutputProductTypeDto | OutputProductTypeDto[] {
    return toOutputDto(e, OutputProductTypeDto);
  }
  
  @ApiCommonFindManyResources('product type', OutputProductTypeDto)
  @Get()
  async findAll(@ParsedQuery({ config: globalQueryParserConfig.productTypes, dto: QueryCommonDto }) queryResult: QueryParserResult) {
    const data = await this.productTypesService.findAll(
      queryResult.selectOptions ?? {},
      queryResult.orderOptions ?? {},
      queryResult.paginationOptions?.skip ?? 0,
      queryResult.paginationOptions?.take ?? 10
    );
    
    return this.dto(data);
  }

  @ApiCommonFindOneResource('product type', OutputProductTypeDto)
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({ config: globalQueryParserConfig.productTypes, dto: QueryCommonDto }) queryResult: QueryParserResult) {
    const data = await this.productTypesService.findOneBySlug(
      slug,
      queryResult.selectOptions ?? {}
    );

    return this.dto(data);
  }

  @ApiCommonCreateResource('product type', CreateProductTypeDto, OutputProductTypeDto)
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateProductTypeDto)) createProductTypeDto: CreateProductTypeDto | CreateProductTypeDto[]) {
    const data = await this.productTypesService.create(createProductTypeDto);
    return this.dto(data); 
  }

  @ApiCommonUpdateResource('product type', CreateProductTypeDto, OutputProductTypeDto)
  @UseGuards(AdminGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    const data = await this.productTypesService.update(slug, updateProductTypeDto);
    return this.dto(data);
  }

  @ApiCommonDeleteResource('product type', OutputProductTypeDto)
  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.productTypesService.remove(slug);
    return this.dto(data);
  }
}
