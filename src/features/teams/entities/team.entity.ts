import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES } from '@constants';
import { Post } from '@features/posts/entities/post.entity';
import { Resource } from '@features/resources/entities/resource.entity';
import { User } from '@features/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity(DATABASE_TABLES.TEAMS)
export class Team extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  alias?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.teams)
  users: Relation<User>[];

  @Column({ type: 'varchar', nullable: true })
  logoUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;

  @OneToMany(() => Resource, (resource) => resource.team)
  resources: Relation<Resource>[];

  @OneToMany(() => Post, (post) => post.team)
  posts: Relation<Post>[];

  @ManyToMany(() => User, (user) => user.teamsCreated)
  createdBy: Relation<User>;
}
