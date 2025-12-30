import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { SlugResourceService } from '../common/';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from './';

@Injectable()
export class CategoriesService extends SlugResourceService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>
  ) {
    super(categoryRepository, 'category');
  }

  private readonly categoryMaxDepth: number = 10; // TODO: move to some separate config. Hard coded rn for prototyping purposes.

  protected defaultSelectOptions = {
    id: true,
    slug: true,
    title: true,
    parentCategory: { id: true, slug: true, title: true },
  };


  private buildDeepRelations(relationName: string, depth: number): string[] {
    let relations: string[] = [];
    let currentPath = relationName;

    for (let i = 1; i <= depth; i++) {
      relations.push(currentPath);
      currentPath = `${currentPath}.${relationName}`;
    }
    return relations;
  };

  async getFlattenedCategoryTree(slug: string): Promise<string[]> {
    const category = await this.findOneBySlug(slug, {}, this.buildDeepRelations('childrenCategories', this.categoryMaxDepth));

    const collectDescendantSlugs = (category: CategoryEntity, slugArray: string[] = []): string[] => {
      slugArray.push(category.slug);
      if (category.childrenCategories && category.childrenCategories.length > 0)
        for (const child of category.childrenCategories) {
          collectDescendantSlugs(child, slugArray);
        }

      return slugArray;
    };
    return collectDescendantSlugs(category);
  }


  async create(createCategoryDto: CreateCategoryDto | CreateCategoryDto[]): Promise<CategoryEntity[] | CategoryEntity> {
    const dtos: CreateCategoryDto[] = Array.isArray(createCategoryDto) ? createCategoryDto : [createCategoryDto];
    const categories: CategoryEntity[] = [];
    await this.categoryRepository.manager.transaction(async (entityManager: EntityManager) => {
      for (const dto of dtos) {
        const { parentCategorySlug, ...categoryData } = dto;
        const category = this.categoryRepository.create(categoryData);
        if (parentCategorySlug)
          category.parentCategory = await this.findOneBySlug(parentCategorySlug);
        await entityManager.save(category);
        categories.push(category);
      }
    });

    return categories.length === 1 ? categories[0] : categories;
  }
  async update(slug: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findOneBySlug(slug);
    const { parentCategorySlug, slug: newSlug, title } = updateCategoryDto;

    if (newSlug) {
      if (await this.findOneBySlug(newSlug))
        throw new ConflictException(ERROR_MESSAGES.DB_UNIQUE_CONSTRAINT_VIOLATION());
      category.slug = newSlug;
    }
    if (title) category.title = title;
    if (parentCategorySlug) category.parentCategory = await this.findOneBySlug(parentCategorySlug);

    await this.categoryRepository.save(category);
    return category;
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<CategoryEntity> = {},
    orderOptions: FindOptionsOrder<CategoryEntity> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<CategoryEntity> = {},
  ): Promise<CategoryEntity[]> {
    const relations: string[] = this.buildDeepRelations('parentCategory', this.categoryMaxDepth);
    return super.findAll(mergeSelectOptions, orderOptions, skip, take, filterOptions, relations);
  }

  async findOneBySlug(
    slug: string,
    mergeSelectOptions: FindOptionsSelect<CategoryEntity> = {},
    customRelations: string[] = []
  ): Promise<CategoryEntity> {
    const relations: string[] = [...customRelations, ...this.buildDeepRelations('parentCategory', this.categoryMaxDepth)];
    return super.findOneBySlug(slug, mergeSelectOptions, relations);
  }


  async remove(slug: string): Promise<CategoryEntity> {
    return super.remove(slug);
  }
}
