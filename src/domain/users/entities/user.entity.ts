import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { Order } from '../../orders/entities/order.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../../auth/roles/enums/roles.enum';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  refreshToken: string;
  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'role_enum',
    default: Role.USER,
  })
  role: Role;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Order, (order) => order.customer, {
    cascade: ['soft-remove', 'recover'],
  })
  orders: Order[];

  get isDeleted() {
    return !!this.registryDates.deletedAt;
  }
}
