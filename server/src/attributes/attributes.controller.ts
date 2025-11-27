import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Controller('admin/attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto);
  }

  @Get()
  findAll() {
    return this.attributesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.attributesService.findOneBySlug(slug);
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
