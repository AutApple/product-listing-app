import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Controller('admin/product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productTypesService.findOneBySlug(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypesService.update(slug, updateProductTypeDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.productTypesService.remove(slug);
  }
}
