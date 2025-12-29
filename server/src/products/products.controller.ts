import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductView, OutputProductDto } from './';
import { ParsedQuery, type QueryParserResult } from '../query-parser/';
import { globalQueryParserConfig } from '../config/';
import { toOutputDto, BulkOrSingleValidationPipe, QueryCommonDto } from '../common/';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { ApiCommonCreateResource, ApiCommonDeleteResource, ApiCommonUpdateResource, ApiCommonFindManyResources, ApiCommonFindOneResource } from '../swagger/';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  private dto(e: ProductView | ProductView[]): OutputProductDto | OutputProductDto[] {
    return toOutputDto(e, OutputProductDto);
  }
  
  @ApiCommonFindManyResources('product', OutputProductDto, true)
  @Get()
  async findAll(@ParsedQuery({ config: globalQueryParserConfig.products, dto: QueryCommonDto }) parsedQuery: QueryParserResult) {
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

  @ApiCommonFindOneResource('product', OutputProductDto)
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({ config: globalQueryParserConfig.products, dto: QueryCommonDto }) parsedQuery: QueryParserResult) {
    const data = await this.productsService.findOneBySlug(slug, parsedQuery.selectOptions ?? {});
    return this.dto(data);
  }

  @ApiCommonCreateResource('product', CreateProductDto, OutputProductDto, true)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateProductDto)) createProductDto: CreateProductDto | CreateProductDto[]) {
    const data = await this.productsService.create(createProductDto);
    return this.dto(data);
  }

  @ApiCommonUpdateResource('product', CreateProductDto, OutputProductDto)
  @UseGuards(AdminGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productsService.update(slug, updateProductDto);
    return this.dto(data);
  }

  @ApiCommonDeleteResource('product', OutputProductDto)
  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.productsService.remove(slug);
    return this.dto(data);
  }
}
