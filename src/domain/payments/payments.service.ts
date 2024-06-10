import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { compareUserId } from '../../auth/util/authorization.util';
import { RequestUser } from '../../auth/interfaces/request-user.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async payOrder(id: string, currentUser: RequestUser) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        payment: true,
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Oder not found');
    }
    compareUserId(currentUser, order.customer.id);

    if (order.payment) {
      throw new ConflictException('Order already paid');
    }

    const payment = this.paymentsRepository.create();
    order.payment = payment;
    order.status = OrderStatus.AWAITING_SHIPMENT;
    return this.ordersRepository.save(order);
  }
}
