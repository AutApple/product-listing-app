import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttributeEntity, CreateAttributeDto, UpdateAttributeDto, OutputAttributeDto } from './';
import { toOutputDto, QueryCommonDto, BulkOrSingleValidationPipe } from '../common/';
import { ParsedQuery, type QueryParserResult } from '../query-parser/';
import { globalQueryParserConfig } from '../config/';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { ApiCommonCreateResource, ApiCommonUpdateResource, ApiCommonDeleteResource, ApiCommonFindManyResources, ApiCommonFindOneResource } from '../swagger/';
import { AttributesService } from './attributes.service.js';

@Controller('admin/attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}
  
  private dto(e: AttributeEntity | AttributeEntity[]): OutputAttributeDto | OutputAttributeDto[] {
      return toOutputDto(e, OutputAttributeDto);
  }

  @ApiCommonFindManyResources('attribute', OutputAttributeDto)
  @Get()
  async findAll(@ParsedQuery({config: globalQueryParserConfig.attributes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    const data = await this.attributesService.findAll(
      queryResult.selectOptions ?? {},
      queryResult.orderOptions ?? {},
      queryResult.paginationOptions?.skip ?? 0,
      queryResult.paginationOptions?.take ?? 10
    );
    return this.dto(data);
  }

  @ApiCommonFindOneResource('attribute', OutputAttributeDto)
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.attributes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    const data = await this.attributesService.findOneBySlug(
      slug,
      queryResult.selectOptions ?? {}
    );
    return this.dto(data);
  }

  @ApiCommonCreateResource('attribute', CreateAttributeDto, OutputAttributeDto)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateAttributeDto)) createAttributeDto: CreateAttributeDto | CreateAttributeDto[]) {
    const data = await this.attributesService.create(createAttributeDto);
    return this.dto(data);
  }

  @ApiCommonUpdateResource('attribute', CreateAttributeDto, OutputAttributeDto)
  @UseGuards(AdminGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    const data = await this.attributesService.update(slug, updateAttributeDto);
    return this.dto(data);
  }

  @ApiCommonDeleteResource('attribute', OutputAttributeDto)
  @UseGuards(AdminGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.attributesService.remove(slug);
    return this.dto(data);
  }
}
