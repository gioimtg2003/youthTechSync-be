import { ActionPermission, SYSTEM_RESOURCE } from '@constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PolicyService {
  constructor() {}
  get() {
    const actions = Object.values(ActionPermission);
    const resource = Object.values(SYSTEM_RESOURCE);
    return { actions, resource };
  }
}
