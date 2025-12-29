import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, InviteType } from '@constants';
import { Team } from '@features/teams/entities/team.entity';
import { Column, Entity, Index, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity(DATABASE_TABLES.USER_INVITES)
export class UserInvite extends BaseEntity {
  static readonly modelName = 'user-invite';

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  uid: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: InviteType, default: InviteType.PRIVATE })
  type: InviteType;

  @ManyToOne(() => User, { nullable: false })
  invitedBy: Relation<User>;

  @ManyToOne(() => Team, { nullable: false })
  team: Relation<Team>;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt?: Date;
}
