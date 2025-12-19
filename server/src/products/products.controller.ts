import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { BulkOrSingleValidationPipe } from '../common/pipes/bulk-or-single-validation.pipe.js';
import { OutputProductDTO } from './dto/output/output-product.dto.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { ProductView } from './views/product.view.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  private dto(e: ProductView | ProductView[]): OutputProductDTO | OutputProductDTO[] {
    return toOutputDto(e, OutputProductDTO);
  }
  
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateProductDto)) createProductDto: CreateProductDto | CreateProductDto[]) {
    const data = await this.productsService.create(createProductDto);
    return this.dto(data);
  }

  
  @Get()
  async findAll(@ParsedQuery({config: globalQueryParserConfig.products, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    const data = await this.productsService.findWithDynamicFilters(
      parsedQuery.selectOptions ?? {}, 
      parsedQuery.orderOptions ?? {}, 
      parsedQuery.paginationOptions?.skip ?? 0, //TODO: default pagination options config.
      parsedQuery.paginationOptions?.take ?? 10,
      parsedQuery.filterOptions ?? {},
      parsedQuery.filterFallbackCollection ?? {}
    );
    
    return this.dto(data);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.products, dto: QueryCommonDto}) parsedQuery: QueryParserResult) {
    const data = await this.productsService.findOneBySlug(slug, parsedQuery.selectOptions ?? {});
    return this.dto(data);
  }

  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productsService.update(slug, updateProductDto);
    return this.dto(data);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.productsService.remove(slug);
    return this.dto(data);
  }
}
