import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from './entities/product-type.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  exports: [ProductTypesService]
})
export class ProductTypesModule {}
