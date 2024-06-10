import {
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { IsCurrency } from '../../../common/decorators/validators/is-currency.decorator';
import { IdDto } from '../../../common/dto/id.dto';
import { IsEntity } from '../../../common/decorators/validators/is-entity.decorator';
export class CreateProductDto {
  @Length(2, 50)
  readonly name: string;

  @IsOptional()
  @Length(1, 500)
  readonly description?: string;

  @IsCurrency()
  readonly price: number;

  @ArrayNotEmpty()
  @IsEntity()
  readonly categories: IdDto[];
}
