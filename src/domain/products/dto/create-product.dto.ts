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
  name: string;

  @IsOptional()
  @Length(1, 500)
  description: string;

  @IsCurrency()
  price: number;

  @ArrayNotEmpty()
  @IsEntity()
  categories: IdDto[];
}
