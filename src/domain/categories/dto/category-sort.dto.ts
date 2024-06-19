import { IsOptional } from 'class-validator';
import { OrderDto } from '../../../quering/dto/order.dto';

const Sort = 'name' as const;
type Sort = typeof Sort;
export class CategoriesSortDto extends OrderDto {
  @IsOptional()
  readonly sort?: Sort;
}
