import { IsOptional, IsPositive, Max } from 'class-validator';
import { IsCardinal } from '../../common/decorators/validators/is-cardinal.decorator';
import { MAX_PAGE_NUMBER, MAX_PAGE_SIZE } from '../util/querying.constants';

export class PaginationDto {
  @IsOptional()
  @Max(MAX_PAGE_SIZE)
  @IsCardinal()
  readonly limit?: number;

  @IsOptional()
  @Max(MAX_PAGE_NUMBER)
  @IsCardinal()
  @IsPositive()
  readonly page?: number = 1;
}
