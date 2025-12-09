import {
  ActionPermission,
  SYSTEM_RESOURCE_AVAILABLE_FOR_PERMISSION,
} from '@constants';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PolicyService {
  constructor() {}
  get() {
    const actions = Object.values(ActionPermission);
    const resource = SYSTEM_RESOURCE_AVAILABLE_FOR_PERMISSION;
    return { actions, resource };
  }
}
