import { SYSTEM_RESOURCE } from '@constants';

export interface IResourceResolver {
  supports(resource: SYSTEM_RESOURCE): boolean;
  getTeamId(resourceId: number): Promise<number | null>;
}
