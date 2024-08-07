import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../quering/dto/pagination.dto';
import { DefaultPageSize } from '../../quering/util/querying.constants';
import { HashingService } from '../../auth/hashing/hashing.service';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { compareUserId } from '../../auth/util/authorization.util';
import { LoginDto } from '../../auth/dtos/login.dto';
import { CloudinaryService } from '../../cloudinary/CloudinaryService';
import { PaginationService } from '../../quering/pagination.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly paginationService: PaginationService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating a user`);
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    this.logger.log(`Getting all users`);

    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.USER;
    const offset = this.paginationService.calculateOffset(limit, page);

    const [data, count] = await this.usersRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    this.logger.log(`Retrieved ${count} users`);

    const meta = this.paginationService.createMeta(limit, page, count);
    return {
      data,
      meta,
    };
  }

  async findOne(id: string) {
    this.logger.log(`Fetching user with id: ${id}`);

    return this.usersRepository.findOneOrFail({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: RequestUser,
  ) {
    compareUserId(currentUser, id);

    this.logger.log(`Updating user with id: ${id}`);

    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      this.logger.warn(`User with Id: ${id} is not found`);
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.save(user);
  }

  async remove(id: string, soft: boolean, currentUser: RequestUser) {
    compareUserId(currentUser, id);
    if (!soft) {
      this.logger.warn(`User with Id: ${id} can not access this resource`);
      throw new ForbiddenException('Forbidden resource');
    }

    const user = await this.findOne(id);

    return soft
      ? this.usersRepository.softRemove(user)
      : this.usersRepository.remove(user);
  }

  async recover(loginDto: LoginDto) {
    this.logger.warn(`Recovering deleted account`);
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.hashingService.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isDeleted) {
      throw new ConflictException('User not deleted');
    }

    return this.usersRepository.recover(user);
  }

  async uploadProfile(id: string, file: Express.Multer.File) {
    const folder = process.env.CLOUDINARY_FOLDER_PROFILES;

    const user = await this.usersRepository.findOneBy({ id });
    const result = await this.cloudinaryService.uploadFile(file, folder);
    user.photo = result.secure_url;
    await this.usersRepository.save(user);
    return user.photo;
  }
}
