import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../../../quering/dto/pagination.dto';
import { ProductFilterDto } from './product-filter.dto';
import { ProductsSortDto } from './products-sort.dto';

export class ProductsQueryDto extends IntersectionType(
  PaginationDto,
  ProductFilterDto,
  ProductsSortDto,
) {}
