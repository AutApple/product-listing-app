import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto.js';
import { QueryHelperService } from '../common/services/query-helper.service.js';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductTypesService } from '../product-types/product-types.service.js';
import AttributeTypes from '../attributes/types/attribute.types.enum.js';
import { ProductAttributeValueEntity } from './entities/product-attribute-value.js';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity) private readonly productImageRepository: Repository<ProductImageEntity>,
    private readonly queryHelperService: QueryHelperService,
    private readonly productTypesService: ProductTypesService
  ) {}

  private validateAndUpsertAttributeValues(
    rawAttributeValues: [{key: string, value: (number | boolean | string)}],
    allowedAttributes: AttributeEntity[],
    mergeAttributeValues?: ProductAttributeValueEntity[] // for update
  ): ProductAttributeValueEntity[]{
    
    let result: ProductAttributeValueEntity[] = mergeAttributeValues ?? [];
    for (const {key, value} of rawAttributeValues) {
        // 2. check if it's an actual attribute that belongs to product type. If not - throw 400
        const attributeEntity = allowedAttributes.find((value) => (value.slug === key));
        
        if(!attributeEntity)
          throw new BadRequestException(`Attribute with key ${key} was not found 
                                          in attributes of a given product type.`); 

        // 3. if type is enum - check if it's one of the enum values.
        if(attributeEntity.type === AttributeTypes.ENUM && !attributeEntity.enumValues.find(v => v.value === value))
          throw new BadRequestException(`Attribute ${key} can only have values of ${attributeEntity.enumValues.map(v => v.value).join(', ')}`);  
        
        // 4. check type constraints
        const expectedTypes = {
            [AttributeTypes.NUMBER]: 'number',
            [AttributeTypes.STRING]: 'string',
            [AttributeTypes.ENUM]:   'string',
            [AttributeTypes.BOOLEAN]:'boolean',
        };

        if(typeof(value) !== expectedTypes[attributeEntity.type])
          throw new BadRequestException(`Value of attribute ${key} should be type of ${attributeEntity.type}`);

        // 5. create ProductAttributeValue with given key and value OR merge if there is mering array
        const valueString = typeof(value) === 'string' ? value : null;
        const valueInt = typeof(value) === 'number' ? value : null;
        const valueBool = typeof(value) === 'boolean' ? value : null;

        const findIndex = result.findIndex(v => v.attributeId === attributeEntity.id)
        if (mergeAttributeValues && findIndex !== -1){
          result[findIndex].valueBool = valueBool;
          result[findIndex].valueInt = valueInt;
          result[findIndex].valueString = valueString;
        } else {
          const attributeValueEntity = new ProductAttributeValueEntity();

          attributeValueEntity.attribute = {id: attributeEntity.id} as AttributeEntity;
          
          attributeValueEntity.valueString = valueString;
          attributeValueEntity.valueInt = valueInt;
          attributeValueEntity.valueBool = valueBool;

          result.push(attributeValueEntity);
        }
    }
    return result;
  }
  private upsertImageUrls(product: ProductEntity, imageUrls: string[], mergeImageUrls?: ProductImageEntity[]): ProductImageEntity[] {
    const result: ProductImageEntity[] = mergeImageUrls ?? [];
    for (const url of imageUrls) {
      if (result.findIndex(v => v.url === url) !== -1) 
        continue;
      result.push(this.productImageRepository.create({url, product}));
    }
    return result;
  }

  async create(createProductDto: CreateProductDto) {
    const {attributes, imageUrls, productTypeSlug, ...productData} = createProductDto;
    const productType = await this.productTypesService.findOneBySlug(
      productTypeSlug,
      ['attributes', 'attributes.enumValues']
    );

    const product: ProductEntity = this.productRepository.create(productData);
    product.productType = productType;
  
    // Assign attributes
    product.attributeValues = this.validateAndUpsertAttributeValues(
      attributes as [{key: string, value: (number | boolean | string)}], 
      productType.attributes 
    );
    
    await this.productRepository.save(product);
    
    // Assign images
    if (imageUrls && imageUrls.length) { // if there are any image urls specified, create entities for them
        const images = this.upsertImageUrls(product, imageUrls);
        await this.productImageRepository.save(images);
        product.images = images;  
    }

    return product;
  }

  async findAll(queryProductDto: QueryProductDto): Promise<ProductEntity[]> {
    let orderOptions = {};
    if(queryProductDto.sort)
      for (const s of queryProductDto.sort)
        Object.assign(orderOptions, this.queryHelperService.sortOptionToKeyValue(s));
    
    return await this.productRepository.find({ order: orderOptions, relations: {images: true, productType: true} });
  }

  async findOneBySlug(slug: string, relations: string[] = []): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({where: {slug}, relations});
    if(!product)
      throw new NotFoundException('Can\'t find a product with specified ID');
    return product;
  }

  async update(slug: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findOneBySlug(
      slug, 
      ['productType', 'productType.attributes', 'productType.attributes.enumValues', 'attributeValues', 'images']
    );
    
    const {attributes, imageUrls, productTypeSlug, ...productData} = updateProductDto;
    
    Object.assign(product, productData);

    if (productTypeSlug)
        product.productType = await this.productTypesService.findOneBySlug(productTypeSlug);   
    
    if (attributes) {
        const newValues = this.validateAndUpsertAttributeValues(
          attributes as [{key: string, value: (number | boolean | string)}], 
          product.productType.attributes, 
          product.attributeValues
        );
        product.attributeValues = newValues;
    }

    if (imageUrls && imageUrls.length) { // if there are any image urls specified, create entities for them
        const images = this.upsertImageUrls(product, imageUrls, product.images);
        await this.productImageRepository.save(images);
        product.images = images;  
    }

    return await this.productRepository.save(product);
  }

  async remove(slug: string) {
    const product = await this.findOneBySlug(slug);
    await this.productRepository.remove(product);
    return product;
  }
}
