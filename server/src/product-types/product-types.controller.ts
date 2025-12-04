import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';

@Controller('admin/product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Get()
  findAll(@ParsedQuery({config: globalQueryParserConfig.productTypes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    return this.productTypesService.findAll(
        queryResult.selectOptions ?? {},
        queryResult.orderOptions ?? {},
        queryResult.paginationOptions?.skip ?? 0,
        queryResult.paginationOptions?.take ?? 10 
    );
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.productTypes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    return this.productTypesService.findOneBySlug(
      slug,
      queryResult.selectOptions ?? {}
    );
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypesService.update(slug, updateProductTypeDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.productTypesService.remove(slug);
  }
}
