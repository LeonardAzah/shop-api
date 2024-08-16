import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { PaginationDto } from '../../quering/dto/pagination.dto';
import { DefaultPageSize } from '../../quering/util/querying.constants';
import { PaginationService } from '../../quering/pagination.service';

@Injectable()
export class RatingsService {
  private readonly logger = new Logger(RatingsService.name);

  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly paginationService: PaginationService,
  ) {}
  async create(id: string, createRatingDto: CreateRatingDto, userId: string) {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const currentUser = await this.userRepository.findOneBy({ id: userId });

    const rating = this.ratingRepository.create({
      ...createRatingDto,
      user: currentUser,
      product,
    });
    return this.ratingRepository.save(rating);
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    const rating = await this.ratingRepository.preload({
      id,
      ...updateRatingDto,
    });
    if (!rating) {
      this.logger.warn(`rating with Id: ${id} is not found`);
      throw new NotFoundException('Review not found');
    }
    return this.ratingRepository.save(rating);
  }

  async remove(id: string) {
    this.logger.log(`Rating product with id: ${id}`);
    const rating = await this.ratingRepository.findOneBy({ id });
    return this.ratingRepository.remove(rating);
  }

  async getProductRatings(productId: string, paginationDto: PaginationDto) {
    this.logger.warn(
      `fetching rating for product with Id: ${productId} is not found`,
    );
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.RATING;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.ratingRepository.findAndCount({
      where: {
        product: {
          id: productId,
        },
      },
      skip: offset,
      take: limit,
    });
    this.logger.log(`Retrieved ${count} comments`);

    const meta = this.paginationService.createMeta(limit, page, count);
    return {
      data,
      meta,
    };
  }
}
