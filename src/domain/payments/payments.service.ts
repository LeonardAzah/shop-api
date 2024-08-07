import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { compareUserId } from '../../auth/util/authorization.util';
import { RequestUser } from '../../auth/interfaces/request-user.interface';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async payOrder(id: string, currentUser: RequestUser) {
    this.logger.log(`${currentUser} paying order`);

    const order = await this.ordersRepository.findOneOrFail({
      where: { id },
      relations: {
        payment: true,
        customer: true,
      },
    });

    compareUserId(currentUser, order.customer.id);

    if (order.payment) {
      this.logger.warn(`Order already paid`);
      throw new ConflictException('Order already paid');
    }

    const payment = this.paymentsRepository.create();
    order.payment = payment;
    order.status = OrderStatus.AWAITING_SHIPMENT;
    return this.ordersRepository.save(order);
  }
}
