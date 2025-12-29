## 📂 Core Workspace Architecture

1. Database Schema Overview
   To support more features (like Roles, Permissions, Folders, or Projects), you should use a Junction Table for members to store metadata about their relationship with the workspace.

2. Detailed Entity Design
   A. Workspace Entity (The Container)

```typescript
@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string; // e.g., "my-awesome-team" for pretty URLs

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  autoAcceptMembers: boolean; // Security option mentioned in your flow

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => WorkspaceMember, (member) => member.workspace)
  members: WorkspaceMember[];
}
```

### 🚀 Expanding Features

Beyond invitations, a professional system usually requires these modules:

1. Permission System (Scopes)
   If "Admin" can delete projects but "Member" cannot, you should add a permissions column (jsonb) to the WorkspaceMember or a separate Role entity.

- Recommendation: Use @nestjs/casl for managing these abilities in your code.

2. Activity Logs (Audit Trail)
   Who invited whom? Who changed the workspace name?

- Table: activity_logs

- Fields: userId, workspaceId, action (string), metadata (jsonb), createdAt.

3. Subscription & Billing (SaaS Logic)
   Limits on how many members a workspace can have.

- Table: subscriptions

- Fields: workspaceId, planType (Free/Pro), status, currentPeriodEnd.
