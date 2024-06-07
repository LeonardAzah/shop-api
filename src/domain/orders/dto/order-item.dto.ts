import { IsCardinal } from '../../../common/decorators/validators/is-cardinal.decorator';
import { IdDto } from '../../../common/dto/id.dto';
import { IsEntity } from '../../../common/decorators/validators/is-entity.decorator';

export class OrderItemDto {
  @IsEntity()
  product: IdDto;

  @IsCardinal()
  quantity: number;
}
