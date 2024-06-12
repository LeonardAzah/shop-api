import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';
import { pathExists } from 'fs-extra';
import { join } from 'path';
import {
  BASE_PATH,
  FilePath,
  MaxFileCount,
} from '../../files/util/file.constants';
import { StorageService } from '../../files/storage/storage.service';

@Injectable()
export class productsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    private readonly storageService: StorageService,
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

  async uploadImages(id: string, files: Express.Multer.File[]) {
    await this.findOne(id);

    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES);

    if (await pathExists(join(BASE_PATH, path))) {
      const incomingFilecount = files.length;
      const dirFilecount = await this.storageService.getDirFilecount(path);
      const totalFilecount = incomingFilecount + dirFilecount;

      this.storageService.validateFilecount(
        totalFilecount,
        MaxFileCount.PRODUCT_IMAGES,
      );
    }

    await this.storageService.createDir(path);

    await Promise.all(
      files.map((file) => this.storageService.saveFile(path, file)),
    );
  }

  async downloadImage(id: string, filename: string) {
    await this.findOne(id);

    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES, filename);

    await this.storageService.validatePath(path);

    return this.storageService.getFile(path);
  }

  async deleteImage(id: string, filename: string) {
    await this.findOne(id);

    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES, filename);

    await this.storageService.validatePath(path);

    await this.storageService.delete(path);
  }

  private async deleteBaseDir(id: string) {
    const { BASE } = FilePath.Products;

    const path = join(BASE, id.toString());
    await this.storageService.delete(path);
  }
}
