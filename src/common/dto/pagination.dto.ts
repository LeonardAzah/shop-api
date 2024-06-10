import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { IsCardinal } from '../decorators/validators/is-cardinal.decorator';

export class PaginationDto {
  @IsOptional()
  @IsCardinal()
  readonly limit?: number;

  @IsOptional()
  @IsCardinal()
  @IsPositive()
  readonly offset?: number;
}
