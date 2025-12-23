import { Module } from '@nestjs/common';
import { ProductTypesController } from './product-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from './';
import { AttributesModule } from '../attributes/attributes.module.js';
import { ProductTypesService } from './product-types.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeEntity]), AttributesModule],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  exports: [ProductTypesService]
})
export class ProductTypesModule {}
