import { Module } from '@nestjs/common';
import { AttributeEntity, AttributeEnumValueEntity } from './';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributesService } from './attributes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity, AttributeEnumValueEntity])],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService]
})
export class AttributesModule {}
