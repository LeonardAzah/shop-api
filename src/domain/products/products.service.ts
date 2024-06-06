import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';

@Injectable()
export class productsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.productsRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.PRODUCT,
    });
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  async update(id: string, updateproductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id,
      ...updateproductDto,
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}
