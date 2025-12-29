import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, UserJoinRequestStatus } from '@constants';
import { Team } from '@features/teams/entities/team.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { UserInvite } from './user-invite.entity';
import { User } from './user.entity';

@Entity(DATABASE_TABLES.USER_JOIN_REQUESTS)
export class UserJoinRequest extends BaseEntity {
  static readonly modelName = 'user-join-request';

  @Column({
    type: 'enum',
    enum: UserJoinRequestStatus,
    default: UserJoinRequestStatus.PENDING,
  })
  status: UserJoinRequestStatus;

  @ManyToOne(() => User, { nullable: false })
  user: Relation<User>;

  @ManyToOne(() => Team, { nullable: false })
  team: Relation<Team>;

  @ManyToOne(() => UserInvite, { nullable: true })
  invite: Relation<UserInvite>;

  @ManyToOne(() => User, { nullable: true })
  actionBy?: Relation<User>;

  @Column({ type: 'text', nullable: true })
  message?: string;
}
