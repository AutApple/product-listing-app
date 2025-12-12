import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { BulkOrSingleValidationPipe } from '../common/pipes/bulk-or-single-validation.pipe.js';
import { AttributeEntity } from './entities/attribute.entity.js';
import { OutputAttributeDTO } from './dto/output/output-attribute.dto.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';

@Controller('admin/attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}
  
  private dto(e: AttributeEntity | AttributeEntity[]): OutputAttributeDTO | OutputAttributeDTO[] {
      return toOutputDto(e, OutputAttributeDTO);
  }
  
  @Post()
  async create(@Body(new BulkOrSingleValidationPipe(CreateAttributeDto)) createAttributeDto: CreateAttributeDto | CreateAttributeDto[]) {
    const data = await this.attributesService.create(createAttributeDto);
    return this.dto(data);
  }

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

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.attributes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    const data = await this.attributesService.findOneBySlug(
      slug,
      queryResult.selectOptions ?? {}
    );
    return this.dto(data);
  }

  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    const data = await this.attributesService.update(slug, updateAttributeDto);
    return this.dto(data);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const data = await this.attributesService.remove(slug);
    return this.dto(data);
  }
}
