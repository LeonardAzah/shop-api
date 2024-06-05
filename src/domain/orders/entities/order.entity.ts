import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { OrderStatus } from '../enums/order-status.enum';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.AWAITING_PAYMENT,
  })
  status: OrderStatus;
  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @ManyToOne(() => User, (user) => user.orders)
  customer: User;
}
