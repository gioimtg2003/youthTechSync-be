import { ActionPermission, SYSTEM_RESOURCE } from '@constants';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PolicyService {
  constructor() {}
  get() {
    const actions = Object.values(ActionPermission);
    const resource = Object.values(SYSTEM_RESOURCE)?.filter(
      (res) =>
        ![
          SYSTEM_RESOURCE.team,
          SYSTEM_RESOURCE.user,
          SYSTEM_RESOURCE.audit,
          SYSTEM_RESOURCE.settings,
          SYSTEM_RESOURCE.permission,
          SYSTEM_RESOURCE.policy,
        ].includes(res),
    );
    return { actions, resource };
  }
}
