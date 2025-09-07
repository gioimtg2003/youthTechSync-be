import { BaseEntity } from '@common/entities/base.entity';
import { DATABASE_TABLES, PostStatus } from '@constants';
import { PostAudit } from '@features/post-audits/entities/post-audit.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity(DATABASE_TABLES.POSTS)
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, { nullable: false })
  author: User;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.draft,
  })
  status: PostStatus;

  @Column('text', { array: true, default: [] })
  thumbnails: string[];

  @OneToMany(() => PostAudit, (postAudit) => postAudit.post)
  audits: Relation<PostAudit>[];
}
