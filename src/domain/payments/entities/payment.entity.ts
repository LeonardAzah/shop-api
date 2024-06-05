import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @OneToOne(() => Order, (order) => order.payment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;
}
