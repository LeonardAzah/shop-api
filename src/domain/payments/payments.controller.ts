import { Controller, Post, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { IdDto } from '../../common/dto/id.dto';
import { CurrentUser } from '../../auth/decorators/currentUser.decorator';
import { RequestUser } from '../../auth/interfaces/request-user.interface';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post(':id')
  payOrder(@Param() { id }: IdDto, @CurrentUser() user: RequestUser) {
    return this.paymentsService.payOrder(id, user);
  }
}
