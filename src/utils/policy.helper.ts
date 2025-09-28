import { ActionPermission, SYSTEM_RESOURCE } from '@constants';

export const parserPolicy = (policy: string) => {
  const [action, resource, ids] = policy.split(':') as [
    ActionPermission,
    SYSTEM_RESOURCE,
    string | undefined,
  ];

  if (!ids || ids === '*' || ids === 'all') {
    return { action, resource, resourceIds: [] };
  }

  const resourceIds = ids ? ids.split(',').map((id) => Number(id)) : [];
  return { action, resource, resourceIds };
};
