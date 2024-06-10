import { Role } from '../roles/enums/roles.enum';

export interface RequestUser {
  readonly id: string;

  readonly role: Role;
}
