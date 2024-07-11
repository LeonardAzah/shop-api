import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { ValidateFilterOperandsLength } from '../decorators/validate-filter-operands-length.decorator';

const Operator = ['lt', 'lte', 'gt', 'gte', 'eq', 'btw'] as const;
type Operator = (typeof Operator)[number];

export class FilterOperationDto {
  @IsOptional()
  @IsIn(Operator)
  readonly operator: Operator;

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly operands: number[];

  @IsOptional()
  @ValidateFilterOperandsLength()
  private readonly manyFieldValidation: any;
}
