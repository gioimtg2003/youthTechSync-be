import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, UserPlan } from '@constants';
import { Role } from '@features/roles/entities/role.entity';
import { Team } from '@features/teams/entities/team.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity(DATABASE_TABLES.USERS)
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'jsonb', nullable: true })
  profile?: Record<string, any>;

  @Column({ type: 'enum', enum: UserPlan, default: UserPlan.FREE })
  plan: UserPlan;

  @ManyToMany(() => Team, (team) => team.users)
  @JoinTable({ name: DATABASE_TABLES.TEAM_USERS })
  teams: Relation<Team>[];

  @OneToMany(() => Role, (role) => role.users)
  @JoinTable({ name: DATABASE_TABLES.USER_ROLES })
  roles: Relation<Role>[];

  @OneToMany(() => Team, (team) => team.createdBy)
  teamsCreated: Relation<Team>[];
}
