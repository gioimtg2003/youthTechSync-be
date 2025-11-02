import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, Policy, SYSTEM_RESOURCE } from '@constants';
import { Team } from '@features/teams/entities/team.entity';
import { User } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, Relation } from 'typeorm';

@Entity(DATABASE_TABLES.ROLES)
export class Role extends BaseEntity {
  static readonly modelName = SYSTEM_RESOURCE.role;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'text', array: true, default: [] })
  permission: Policy[];

  @ManyToOne(() => Team, (team) => team.roles)
  team: Relation<Team>;

  @ManyToMany(() => User, (user) => user.roles)
  users: Relation<User>[];
}
