import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, PostAuditAction } from '@constants';
import { Post } from '@features/posts/entities/post.entity';
import { User } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity(DATABASE_TABLES.POST_AUDITS)
export class PostAudit extends BaseEntity {
  @Column({
    type: 'enum',
    enum: PostAuditAction,
  })
  action: PostAuditAction;

  @ManyToOne(() => Post, (post) => post.audits, { nullable: false })
  post: Relation<Post>;

  @ManyToOne(() => User, { nullable: false })
  editor: Relation<User>;

  @Column({ type: 'text' })
  contentSnapshot: string;
}
