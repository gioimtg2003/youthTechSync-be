export const DATABASE_TABLES = {
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  USER_ROLES: 'user_roles',
  ROLE_PERMISSIONS: 'role_permissions',
  TEAMS: 'teams',
  TEAM_USERS: 'team_users',
  RESOURCES: 'resources',
  RESOURCE_PERMISSIONS: 'resource_permissions',
  POSTS: 'posts',
  POST_AUDITS: 'post_audits',
};

export enum PostStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export enum ResourceType {
  blog = 'blog',
  event = 'event',
  document = 'document',
  other = 'other',
}

export enum PostAuditAction {
  created = 'created',
  edited = 'edited',
  deleted = 'deleted',
}

/** ***********Permission*********** */
export enum ActionPermission {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}

export enum SYSTEM_RESOURCE {
  all = 'all',
  posts = 'posts',
  users = 'users',
  teams = 'teams',
  roles = 'roles',
  permissions = 'permissions',
  resources = 'resources',
  audits = 'audits',
}

export type ResourcePermission =
  | `${SYSTEM_RESOURCE}`
  | `${SYSTEM_RESOURCE}:${number}`; // e.g., posts:1, users:2

export type Policy = `${ActionPermission}:${ResourcePermission}`; // e.g., create:posts:1, read:users:2
/** ***********End Permission*********** */
