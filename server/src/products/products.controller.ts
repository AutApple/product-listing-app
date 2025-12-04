import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, SetMetadata } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  
  @Get()
  findAll(@ParsedQuery({config: globalQueryParserConfig.products, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    return this.productsService.findAll(
      parsedQuery.selectOptions ?? {}, 
      parsedQuery.orderOptions ?? {}, 
      parsedQuery.paginationOptions?.skip ?? 0, //TODO: default pagination options config.
      parsedQuery.paginationOptions?.take ?? 10,
      parsedQuery.filterOptions ?? {}
    );
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.products, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    return this.productsService.findOneBySlugDTO(slug, parsedQuery.selectOptions ?? {});
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(slug, updateProductDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.productsService.remove(slug);
  }
}
