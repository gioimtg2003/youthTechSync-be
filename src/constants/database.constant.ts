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

export enum UserPlan {
  FREE = 1,
  PREMIUM = 2,
  UNLIMITED = 3,
}

export enum PostStatus {
  DRAFT = 1,
  PUBLISHED = 2,
  ARCHIVED = 3,
}

export enum ResourceType {
  BLOG = 1,
  EVENT = 2,
  DOCUMENT = 3,
  OTHER = 4,
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
  'user-team' = 'user-team',
  role = 'role',
  user = 'user',
  team = 'team',
  post = 'post',
  resource = 'resource',
  policy = 'policy',
  settings = 'settings',
  permission = 'permission',
  audit = 'audit',
}

export type ResourcePermission =
  | `${SYSTEM_RESOURCE}`
  | `${SYSTEM_RESOURCE}::${number | 'all'}`; // e.g., posts:1; users:2,2,3,4,5

export type Policy = `${ActionPermission}:${ResourcePermission}`; // e.g., create:posts:1, read:users:2
/** ***********End Permission*********** */
