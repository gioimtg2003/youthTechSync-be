import { UserPlan } from '@constants';

/**
 * Interface representing a user session.
 */
export interface IUserSession {
  id: number;
  plan: UserPlan;
  username: string;
  profile?: Record<string, any>;
  permission?: string[];
}

export interface IUserJWT {
  id: number;
}
