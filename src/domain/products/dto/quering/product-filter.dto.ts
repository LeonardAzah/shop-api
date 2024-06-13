import { IsOptional, IsString } from 'class-validator';
import { NameFilterDto } from '../../../../quering/dto/name-filter.dto';
import { IsCurrency } from '../../../../common/decorators/validators/is-currency.decorator';

export class ProductFilterDto extends NameFilterDto {
  @IsOptional()
  @IsCurrency()
  readonly price?: number;
  @IsOptional()
  @IsString()
  readonly categotyId?: string;
}
