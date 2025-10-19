export enum REDIS_MODULE_CONNECTION {
  DEFAULT = 'DEFAULT',
  CACHE = 'CACHE',
}

export const CACHE_KEY_SYSTEM = {
  RESOURCE_POSTS: 'resource:posts',
  USER: 'user',
  TEAM_ALIAS: 'team:alias',
  SESSION: 'sess',
};

export const REDIS_CACHE_TTL = {
  TEAM_ALIAS: 3600,
};
