import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { NameFilterDto } from '../../../../quering/dto/name-filter.dto';
import { IsCurrency } from '../../../../common/decorators/validators/is-currency.decorator';
import { ToFilterOperationDto } from '../../../../quering/decorators/to-filter-operation-dto.decorator';
import { FilterOperationDto } from '../../../../quering/dto/filter-operation.dto';

export class ProductFilterDto extends NameFilterDto {
  @IsOptional()
  @ValidateNested()
  @ToFilterOperationDto()
  readonly price?: FilterOperationDto;
  @IsOptional()
  @IsString()
  readonly categotyId?: string;
}
