import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { IsEntity } from '../../../common/decorators/validators/is-entity.decorator';
import { IdDto } from '../../../common/dto/id.dto';

export class CreateRatingDto {
  @IsEntity()
  productId: IdDto;

  @IsNumber()
  @Min(0)
  @Max(5)
  score: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
