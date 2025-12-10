import { BaseUuidEntity } from '@common/entities/base-uuid.entity';
import { ContentAuditAction, DATABASE_TABLES } from '@constants';
import { Content } from '@features/content/entities/content.entity';
import { User } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity(DATABASE_TABLES.CONTENT_AUDITS)
export class ContentAudit extends BaseUuidEntity {
  @Column({
    type: 'enum',
    enum: ContentAuditAction,
  })
  action: ContentAuditAction;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', nullable: true })
  requestId: string;

  @ManyToOne(() => User, { nullable: false })
  editor: Relation<User>;

  @ManyToOne(() => Content, { nullable: false })
  content: Relation<Content>;
}
