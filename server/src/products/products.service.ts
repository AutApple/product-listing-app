import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { EntityManager, FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductTypesService } from '../product-types/product-types.service.js';
import AttributeTypes from '../attributes/types/attribute.types.enum.js';
import { ProductAttributeValueEntity } from './entities/product-attribute-value.entity.js';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { FilterEntry } from '../common/dto/query.common.dto.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';
import { ProductTypeEntity } from '../product-types/entities/product-type.entity.js';
import { CategoryEntity } from '../categories/entities/category.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
import { ProductsFilterService } from './products-filter.service.js';
import { SlugResourceService } from '../common/slug-resource.service.js';
import { ProductView } from './views/product.view.js';


@Injectable()
export class ProductsService extends SlugResourceService<ProductView> {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity) private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ProductView) private readonly productViewRepository: Repository<ProductView>,
    private readonly productTypesService: ProductTypesService,
    private readonly categoriesService: CategoriesService,
    private readonly productsFilterService: ProductsFilterService
  ) {
    super(productViewRepository, 'product', false);
  }

  protected readonly defaultSelectOptions: FindOptionsSelect<ProductView> = {
    id: true,
    slug: true,
    title: true,
    description: true,
    shortDescription: true,
    productTypeSlug: true,
    createdAt: true,
    updatedAt: true,
    price: true,
    categorySlug: true,
    averageRating: true,
    reviewCount: true
  };

  private validateAttributeValues(
    rawAttributeValues: [{ key: string, value: (number | boolean | string); }],
    allowedAttributes: AttributeEntity[]
  ): void {
    for (const { key, value } of rawAttributeValues) {
      // check if it's an actual attribute that belongs to product type. If not - throw 400
      const attributeEntity = allowedAttributes.find((value) => (value.slug === key));

      if (!attributeEntity)
        throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND(key));

      // if type is enum - check if it's one of the enum values.
      if (attributeEntity.type === AttributeTypes.ENUM && !attributeEntity.enumValues.find(v => v.value === value))
        throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_BAD_REQUEST(key, attributeEntity.enumValues.map(v => v.value)));

      // check type constraints
      const expectedTypes = {
        [AttributeTypes.NUMBER]: 'number',
        [AttributeTypes.STRING]: 'string',
        [AttributeTypes.ENUM]: 'string',
        [AttributeTypes.BOOLEAN]: 'boolean',
      };

      if (typeof (value) !== expectedTypes[attributeEntity.type])
        throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_WRONG_TYPE(key, attributeEntity.type));
    }
  }

  // should be called after validation
  private upsertAttributeValues(
    rawAttributeValues: [{ key: string, value: (number | boolean | string); }],
    allowedAttributes: AttributeEntity[],
    mergeAttributeValues?: ProductAttributeValueEntity[] // for update
  ): ProductAttributeValueEntity[] {
    let result: ProductAttributeValueEntity[] = mergeAttributeValues ?? [];
    for (const { key, value } of rawAttributeValues) {
      // get attribute entity
      const attributeEntity = allowedAttributes.find((value) => (value.slug === key));

      if (!attributeEntity)
        throw new BadRequestException(ERROR_MESSAGES.ATTRIBUTE_NOT_FOUND(key));

      // create ProductAttributeValue with given key and value OR merge if there is mering array
      const valueString = typeof (value) === 'string' ? value : null;
      const valueInt = typeof (value) === 'number' ? value : null;
      const valueBool = typeof (value) === 'boolean' ? value : null;

      const findIndex = result.findIndex(v => v.attributeId === attributeEntity.id);

      if (mergeAttributeValues && findIndex !== -1) {
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
      result.push(this.productImageRepository.create({ url, product }));
    }
    return result;
  }

  private async validateAndPreloadProductTypes(
    dtos: CreateProductDto[]
  ) {
    const productTypeMap: Map<string, ProductTypeEntity> = new Map<string, ProductTypeEntity>();
    for (const dto of dtos) {
      const { attributes, productTypeSlug } = dto;
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
      if (!productType)
        throw new BadRequestException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('product type', productTypeSlug));
      this.validateAttributeValues(
        attributes as [{ key: string, value: (number | boolean | string); }],
        productType.attributes
      );
      productTypeMap.set(productTypeSlug, productType);
    }
    return productTypeMap;
  }

  private async createProductsWithAttributesAndImages(
    dtos: CreateProductDto[],
    productTypeMap: Map<string, ProductTypeEntity>
  ) {
    const products: ProductEntity[] = [];

    await this.productRepository.manager.transaction(async (entityManager: EntityManager) => {
      for (const dto of dtos) {
        const { attributes, imageUrls, productTypeSlug, categorySlug, ...productData } = dto;
        const productType: ProductTypeEntity | undefined = productTypeMap.get(productTypeSlug);
        if (!productType)
          throw new BadRequestException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('product type', productTypeSlug));

        const category: CategoryEntity = await this.categoriesService.findOneBySlug(categorySlug);

        const product: ProductEntity = this.productRepository.create(productData);

        product.productType = productType;
        product.category = category;


        // Assign attributes
        product.attributeValues = this.upsertAttributeValues(
          attributes as [{ key: string, value: (number | boolean | string); }],
          productType.attributes
        );
        await entityManager.save(product);
        // Assign images
        if (imageUrls && imageUrls.length) { // if there are any image urls specified, create entities for them
          const images = this.upsertImageUrls(product, imageUrls);
          await entityManager.save(images);
          product.images = images;
        }
        products.push(product);
      }
    });

    return products;
  }

  async create(dto: CreateProductDto | CreateProductDto[]): Promise<ProductView | ProductView[]> {
    const dtos: CreateProductDto[] = Array.isArray(dto) ? dto : [dto];

    const productTypeMap = await this.validateAndPreloadProductTypes(dtos);
    let products: ProductEntity[] = await this.createProductsWithAttributesAndImages(dtos, productTypeMap);


    return (products.length === 1) ? ProductView.generateFromEntity(products[0]) : products.map(p => ProductView.generateFromEntity(p));
  }

  async update(slug: string, updateProductDto: UpdateProductDto): Promise<ProductView> {
    const product = await this.findEntityBySlug(
      slug,
      ['attributeValues', 'images', 'productType', 'productType.attribute', 'attributeValues.attribute']
    );

    const { attributes, imageUrls, productTypeSlug, categorySlug, ...productData } = updateProductDto;

    Object.assign(product, productData);

    if (productTypeSlug)
      product.productType = await this.productTypesService.findOneBySlug(productTypeSlug);
    if (categorySlug)
      product.category = await this.categoriesService.findOneBySlug(categorySlug);

    if (attributes) {
      this.validateAttributeValues(
        attributes as [{ key: string, value: (number | boolean | string); }],
        product.productType.attributes
      );
      const newValues = this.upsertAttributeValues(
        attributes as [{ key: string, value: (number | boolean | string); }],
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
    const view = await this.findOneBySlug(slug);
    return view;
  }

  async findWithDynamicFilters(
    mergeSelectOptions: FindOptionsSelect<ProductView> = {},
    orderOptions: FindOptionsOrder<ProductView> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<ProductView> = {},
    fallbackFilterCollection: Record<string, FilterEntry[]> = {}
  ): Promise<ProductView[]> {
    // 1. apply category filters 
    filterOptions = deepMergeObjects(filterOptions, await this.productsFilterService.createCategoryFilters(fallbackFilterCollection));
    // 2. treat other fallback filters as an attribute filters
    filterOptions = deepMergeObjects(filterOptions, await this.productsFilterService.createAttributeFilters(fallbackFilterCollection));

    return await this.findAll(
      mergeSelectOptions,
      orderOptions,
      skip,
      take,
      filterOptions
    );
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ProductView> = {},
    orderOptions: FindOptionsOrder<ProductView> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<ProductView> = {},
  ): Promise<ProductView[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take, filterOptions);
  }

  async findOneBySlug(
    slug: string,
    mergeSelectOptions: FindOptionsSelect<ProductView> = {}
  ): Promise<ProductView> {
    return super.findOneBySlug(slug, mergeSelectOptions);
  }

  async findEntityBySlug(
    slug: string,
    customRelations: string[] = []
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: customRelations
    });

    if (!product)
      throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('product', slug, 'slug'));
    return product;
  }

  async remove(slug: string): Promise<ProductView> {
    return super.remove(slug);
  }
}
