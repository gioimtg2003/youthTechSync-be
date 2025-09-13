import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, ResourceType } from '@constants';
import { Team } from '@features/teams/entities/team.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity(DATABASE_TABLES.RESOURCES)
export class Resource extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'enum', enum: ResourceType, default: ResourceType.BLOG })
  type: ResourceType;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Resource)
  parent?: Relation<Resource>;

  @OneToMany(() => Resource, (item) => item.parent)
  children?: Relation<Resource>[];

  @ManyToOne(() => Team, (team) => team.resources, { nullable: true })
  team: Relation<Team>;
}
