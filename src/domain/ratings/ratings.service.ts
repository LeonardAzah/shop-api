import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { IdDto } from '../../common/dto/id.dto';
import { PaginationDto } from '../../quering/dto/pagination.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createRatingDto: CreateRatingDto, user: RequestUser) {
    try {
      console.log('Rating service....');

      const { productId, score, comment } = createRatingDto;
      console.log({ score: score });
      const product = await this.productRepository.findOneBy({
        id: productId.id,
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const rating = this.ratingRepository.create({
        score,
        comment,
        product,
        user,
      });
      return this.ratingRepository.save(rating);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return this.ratingRepository.find();
  }

  async findOne(id: string) {
    return `This action returns a #${id} rating`;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  async remove(id: string) {
    return `This action removes a #${id} rating`;
  }
}
