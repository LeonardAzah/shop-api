import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IdDto } from '../../common/dto/id.dto';
import { PaginationDto } from '../../quering/dto/pagination.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CategoryQueryDto } from './dto/category-query.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly logger: Logger,
  ) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.log('Handling request to create a category');
    return this.categoriesService.create(createCategoryDto);
  }
  @Public()
  @Get()
  findAll(@Query() categoryQueryDto: CategoryQueryDto) {
    this.logger.log('Handling request to get all categories');
    return this.categoriesService.findAll(categoryQueryDto);
  }
  @Public()
  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    this.logger.log(`Handling request to get category with id: ${id}`);
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdDto, @Body() updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Handling request to update category with id: ${id}`);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    this.logger.log(`Handling request to remove category with id: ${id}`);
    return this.categoriesService.remove(id);
  }
}
