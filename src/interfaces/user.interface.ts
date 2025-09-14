import { UserPlan } from '@constants';

/**
 * Interface representing a user session.
 */
export interface IUserSession {
  id: number;
  plan: UserPlan;
  username: string;
  email: string;

  isAdmin?: boolean;
  roles?: string[];
  permission?: string[];

  profile?: Record<string, any>;
}
