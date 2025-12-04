import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';

@Controller('admin/attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto);
  }

  @Get()
  findAll(@ParsedQuery({config: globalQueryParserConfig.attributes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    return this.attributesService.findAll(
      queryResult.selectOptions ?? {},
      queryResult.orderOptions ?? {},
      queryResult.paginationOptions?.skip ?? 0,
      queryResult.paginationOptions?.take ?? 10
    );
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @ParsedQuery({config: globalQueryParserConfig.attributes, dto: QueryCommonDto}) queryResult: QueryParserResult) {
    return this.attributesService.findOneBySlugDTO(
      slug,
      queryResult.selectOptions ?? {}
    );
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.update(slug, updateAttributeDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.attributesService.remove(slug);
  }
}
