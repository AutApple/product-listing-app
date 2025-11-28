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

  
  async create(createProductDto: CreateProductDto) {
    const {attributes, imageUrls, productTypeSlug, ...productData} = createProductDto;
    const productType = await this.productTypesService.findOneBySlug(productTypeSlug);

    const product: ProductEntity = this.productRepository.create(productData);
    product.productType = productType;
    product.attributeValues = [];
    // Set attributes
    // 1. iterate through each attribute
    for (const {key, value} of attributes) {
        // 2. check if it's an actual attribute that belongs to product type. If not - throw 400
        const attributeObject = productType.attributes.find((value) => (value.slug === key));
        
        if(!attributeObject)
          throw new BadRequestException(`Attribute with key ${key} was not found 
                                          in attributes of product type ${productType.slug}`); 

        // 3. if type is enum - check if it's one of the enum values.
        if(attributeObject.type === AttributeTypes.ENUM && !attributeObject.enumValues.find(v => v.value === value))
          throw new BadRequestException(`Attribute ${key} can only have values of ${attributeObject.enumValues.map(v => v.value).join(', ')}`);  
        
        // 4. check type constraints
        const expectedTypes = {
            [AttributeTypes.NUMBER]: 'number',
            [AttributeTypes.STRING]: 'string',
            [AttributeTypes.ENUM]:   'string',
            [AttributeTypes.BOOLEAN]:'boolean',
        };

        if(typeof(value) !== expectedTypes[attributeObject.type])
          throw new BadRequestException(`Value of attribute ${key} should be type of ${attributeObject.type}`);

        // 5. finally create ProductAttributeValue with given key and value after all validation steps
        const attributeValueEntity = new ProductAttributeValueEntity();
        
    
        attributeValueEntity.product = {id: product.id} as ProductEntity;
        attributeValueEntity.attribute = {id: attributeObject.id} as AttributeEntity;
        
        attributeValueEntity.valueString = typeof(value) === 'string' ? value : null;
        attributeValueEntity.valueInt = typeof(value) === 'number' ? value : null;
        attributeValueEntity.valueBool = typeof(value) === 'boolean' ? value : null;

        product.attributeValues.push(attributeValueEntity);
    }
    
    await this.productRepository.save(product);
    
    // Set image urls
    if (imageUrls && imageUrls.length) { // if there are any image urls specified, create entities for them
        const images = imageUrls.map(url => this.productImageRepository.create({url, product}));
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

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({id});
    if(!product)
      throw new NotFoundException('Can\'t find a product with specified ID');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findOne(id);    
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }
}
