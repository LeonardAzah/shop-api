import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../../quering/dto/pagination.dto';
import { CategoriesSortDto } from './category-sort.dto';

export class CategoryQueryDto extends IntersectionType(
  PaginationDto,
  CategoriesSortDto,
) {}
