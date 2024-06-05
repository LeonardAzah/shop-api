import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
