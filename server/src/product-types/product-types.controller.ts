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
import { OutputProductTypeDTO } from './dto/output/output-product-type.dto.js';
import { ProductTypeEntity } from './entities/product-type.entity.js';
import { AdminGuard } from '../auth/guards/admin.guard.js';

@Controller('admin/product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) { }
  
  private dto(e: ProductTypeEntity | ProductTypeEntity[]): OutputProductTypeDTO | OutputProductTypeDTO[] {
    return toOutputDto(e, OutputProductTypeDTO);
  }

  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateProductTypeDto)) createProductTypeDto: CreateProductTypeDto | CreateProductTypeDto[]) {
    const data = await this.productTypesService.create(createProductTypeDto);
    return this.dto(data); 
  }

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

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({ config: globalQueryParserConfig.productTypes, dto: QueryCommonDto }) queryResult: QueryParserResult) {
    const data = await this.productTypesService.findOneBySlug(
      slug,
      queryResult.selectOptions ?? {}
    );

    return this.dto(data);
  }
  @UseGuards(AdminGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    const data = await this.productTypesService.update(slug, updateProductTypeDto);
    return this.dto(data);
  }

  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.productTypesService.remove(slug);
    return this.dto(data);
  }
}
