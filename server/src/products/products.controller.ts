import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, SetMetadata } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import { ParsedQuery } from '../common/transformers/parsed-query.transformer.js';
import { productsQueryParserConfig } from './query-parser-config/products.query-parser-config.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  
  @Get()
  findAll(@ParsedQuery({config: productsQueryParserConfig, dto: QueryCommonDto}) query: QueryCommonDto) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOneBySlugDTO(slug);
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
