import { Controller, Post, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { IdDto } from '../../common/dto/id.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post(':id')
  payOrder(@Param() { id }: IdDto) {
    return this.paymentsService.payOrder(id);
  }
}
