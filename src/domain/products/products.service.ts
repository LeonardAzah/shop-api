import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { DefaultPageSize } from '../../quering/util/querying.constants';
import { PaginationService } from '../../quering/pagination.service';
import { ProductsQueryDto } from './dto/quering/products-query.dto';
import { FilteringService } from '../../quering/filtering.service';

@Injectable()
export class productsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    private readonly paginationService: PaginationService,
    private readonly filteringService: FilteringService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(productsQueryDto: ProductsQueryDto) {
    const { page, name, price, categotyId, sort, order } = productsQueryDto;
    const limit = productsQueryDto.limit ?? DefaultPageSize.PRODUCT;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.productsRepository.findAndCount({
      where: {
        name: this.filteringService.constains(name),
        price: this.filteringService.compare(price),
        categories: { id: categotyId },
      },
      order: {
        [sort]: order,
      },
      skip: offset,
      take: limit,
    });
    const meta = this.paginationService.createMeta(limit, page, count);
    return {
      data,
      meta,
    };
  }

  async findOne(id: string) {
    return this.productsRepository.findOneOrFail({
      where: { id },
      relations: {
        categories: true,
      },
    });
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
