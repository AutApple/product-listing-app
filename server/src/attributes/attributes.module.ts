import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity.js';
import { AttributeEnumValueEntity } from './entities/attribute-enum-value.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity, AttributeEnumValueEntity])],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}
