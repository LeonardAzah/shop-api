import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { IsEntity } from '../../../common/decorators/is-entity.decorator';
import { IdDto } from '../../../common/dto/id.dto';
import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsEntity()
  customer: IdDto;
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
