import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../quering/dto/pagination.dto';
import { DefaultPageSize } from '../../quering/util/querying.constants';
import { OrderItemDto } from './dto/order-item.dto';
import { Product } from '../products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaginationService } from '../../quering/pagination.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;
    this.logger.log(`Creating order with items`);
    const itemsWithPrice = await Promise.all(
      items.map((item) => this.createOrderItemWithPrice(item)),
    );

    const order = this.ordersRepository.create({
      ...createOrderDto,
      items: itemsWithPrice,
    });
    return this.ordersRepository.save(order);
  }

  async findAll(paginationDto: PaginationDto) {
    this.logger.log(`fetching all orders`);

    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.ORDER;
    const offset = this.paginationService.calculateOffset(limit, page);

    const [data, count] = await this.ordersRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    this.logger.log(`Retrieved ${count} orders`);

    const meta = this.paginationService.createMeta(limit, page, count);
    return {
      data,
      meta,
    };
  }

  async findOne(id: string) {
    this.logger.log(`Fetching order with id: ${id}`);
    return this.ordersRepository.findOneOrFail({
      where: { id },
      relations: {
        items: {
          product: true,
        },
        customer: true,
        payment: true,
      },
    });
  }

  async remove(id: string) {
    this.logger.log(`Removing order with id: ${id}`);
    const order = await this.findOne(id);
    return this.ordersRepository.remove(order);
  }

  private async createOrderItemWithPrice(orderItemDto: OrderItemDto) {
    const { id } = orderItemDto.product;

    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { price } = product;

    const orderItem = this.orderItemsRepository.create({
      ...orderItemDto,
      price,
    });

    return orderItem;
  }
}
