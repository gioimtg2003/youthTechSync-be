import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, Policy } from '@constants';
import { User } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToMany, Relation } from 'typeorm';

@Entity(DATABASE_TABLES.ROLES)
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'text', array: true, default: [] })
  permission: Policy[];

  @ManyToMany(() => User, (user) => user.roles)
  users: Relation<User>[];
}
