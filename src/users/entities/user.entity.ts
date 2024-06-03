import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDates } from '../../common/embedded/registry-dates.embedded';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
