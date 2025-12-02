import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { FindOptionsOrder, FindOptionsSelect, Repository } from 'typeorm';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductTypesService } from '../product-types/product-types.service.js';
import AttributeTypes from '../attributes/types/attribute.types.enum.js';
import { ProductAttributeValueEntity } from './entities/product-attribute-value.js';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { OutputProductDTO } from './dto/output/output-product.dto.js';
import { BaseService } from '../common/base.service.js';


@Injectable()
export class ProductsService extends BaseService<ProductEntity, OutputProductDTO>{
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity) private readonly productImageRepository: Repository<ProductImageEntity>,
    private readonly productTypesService: ProductTypesService
  ) { 
    super(productRepository, OutputProductDTO, 'product')
  }

  protected readonly defaultSelectOptions: FindOptionsSelect<ProductEntity> = {
      id: true, 
      slug: true,
      title: true,
      description: true,
      shortDescription: true,
      productType: {slug: true, id: true},
      createdAt: true,
      updatedAt: true,
  };

  private validateAndUpsertAttributeValues(
    rawAttributeValues: [{key: string, value: (number | boolean | string)}],
    allowedAttributes: AttributeEntity[],
    mergeAttributeValues?: ProductAttributeValueEntity[] // for update
  ): ProductAttributeValueEntity[] {
    let result: ProductAttributeValueEntity[] = mergeAttributeValues ?? [];
    for (const {key, value} of rawAttributeValues) {
        // 2. check if it's an actual attribute that belongs to product type. If not - throw 400
        const attributeEntity = allowedAttributes.find((value) => (value.slug === key));

        if(!attributeEntity)
          throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND(key)); 

        // 3. if type is enum - check if it's one of the enum values.
        if(attributeEntity.type === AttributeTypes.ENUM && !attributeEntity.enumValues.find(v => v.value === value))
          throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_BAD_REQUEST(key, attributeEntity.enumValues.map(v => v.value)));  
        
        // 4. check type constraints
        const expectedTypes = {
            [AttributeTypes.NUMBER]: 'number',
            [AttributeTypes.STRING]: 'string',
            [AttributeTypes.ENUM]:   'string',
            [AttributeTypes.BOOLEAN]:'boolean',
        };

        if(typeof(value) !== expectedTypes[attributeEntity.type])
          throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_WRONG_TYPE(key, attributeEntity.type));

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

          attributeValueEntity.attribute = attributeEntity;
          
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

  async create(createProductDto: CreateProductDto): Promise<OutputProductDTO> {
    const {attributes, imageUrls, productTypeSlug, ...productData} = createProductDto;
    const productType = await this.productTypesService.findOneBySlug(
      productTypeSlug,
      {
        id: true,
        attributes: {
          id: true,
          title: true,
          enumValues: {
            id: true
          }
        }
      }
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

    return new OutputProductDTO(product);
  }

  async update(slug: string, updateProductDto: UpdateProductDto): Promise<OutputProductDTO> {
      const product = await this.findOneBySlug(
        slug,
        {
          productType: {
              attributes: {
                  id: true,
                  slug: true,
                  type: true,
                  enumValues: {
                      id: true,
                      attribute: true,
                      value: true
                  }
              }
          },
          attributeValues: {
            attributeId: true,
            productId: true,
            attribute: {
              id: true
            },
            product: {
              id: true
            }
          },
          images: {
            id: true,
            url: true
          }
        }
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
    await this.productRepository.save(product);

    if (imageUrls && imageUrls.length) { // if there are any image urls specified, create entities for them
        const images = this.upsertImageUrls(product, imageUrls, product.images);
        await this.productImageRepository.save(images);
        product.images = images;  
    }
 
    return new OutputProductDTO(product);
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ProductEntity> = {},
    orderOptions: FindOptionsOrder<ProductEntity> = {},
    skip: number = 0,
    take: number = 10
  ): Promise<OutputProductDTO[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take);
  }

  async findOneBySlug(
    slug: string, 
    mergeSelectOptions: FindOptionsSelect<ProductEntity> = {}
  ): Promise<ProductEntity> {
    return super.findOneBySlug(slug, mergeSelectOptions);
  }

  async findOneBySlugDTO(slug: string,  mergeSelectOptions: FindOptionsSelect<ProductEntity> = {}): Promise<OutputProductDTO> {
    return super.findOneBySlugDTO(slug, mergeSelectOptions)
  }

  async remove(slug: string): Promise<OutputProductDTO> {
    return super.remove(slug);
  }
}
