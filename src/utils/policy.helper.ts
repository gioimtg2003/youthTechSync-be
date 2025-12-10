import {
  ActionPermission,
  SEPARATOR_POLICY,
  SYSTEM_RESOURCE,
} from '@constants';

export const parserPolicy = (policy: string) => {
  const [action, resource, ids] = policy.split(SEPARATOR_POLICY) as [
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
