import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../quering/dto/pagination.dto';
import { DefaultPageSize } from '../../quering/util/querying.constants';
import { Category } from './entities/category.entity';
import { PaginationService } from '../../quering/pagination.service';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log(`Creating a category`);

    const category = await this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(categoryQueryDto: CategoryQueryDto) {
    this.logger.log(`Getting all category`);

    const { page, order, sort } = categoryQueryDto;
    const limit = categoryQueryDto.limit ?? DefaultPageSize.CATEGORY;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.categoriesRepository.findAndCount({
      order: {
        [sort]: order,
      },
      skip: offset,
      take: limit,
    });
    this.logger.log(`Retrieved ${count} categories`);
    const meta = this.paginationService.createMeta(limit, page, count);
    return {
      data,
      meta,
    };
  }

  async findOne(id: string) {
    this.logger.log(`Fetching category with id: ${id}`);
    return this.categoriesRepository.findOneOrFail({
      where: { id },
      relations: {
        products: true,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category with id: ${id}`);

    const category = await this.categoriesRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      this.logger.warn(`Category with Id: ${id} is not found`);
      throw new NotFoundException('Category not found');
    }
    return this.categoriesRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (category.products.length > 0) {
      this.logger.warn(`Category with Id: ${id} has related`);

      throw new ConflictException('Category has related products');
    }

    return this.categoriesRepository.remove(category);
  }
}
