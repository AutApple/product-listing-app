import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { BulkOrSingleValidationPipe } from '../common/pipes/bulk-or-single-validation.pipe.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputProductTypeDTO as OutputProductTypeDto } from './dto/output/output-product-type.dto.js';
import { ProductTypeEntity } from './entities/product-type.entity.js';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { ApiCommonFindManyResources, ApiCommonFindOneResource } from '../swagger/decorators/common-find.decorator.js';
import { ApiCommonCreateResource } from '../swagger/decorators/common-create.decorator.js';
import { ApiCommonUpdateResource } from '../swagger/decorators/common-update.decorator.js';
import { ApiCommonDeleteResource } from '../swagger/decorators/common-delete.decorator.js';

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
