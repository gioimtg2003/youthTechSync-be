import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import {
  ActionPermission,
  ResourcePermission,
  SYSTEM_RESOURCE,
} from '@constants';
import { User } from '@features/users/entities/user.entity';
import { IUserSession } from '@interfaces';

import { Injectable } from '@nestjs/common';

export type Subjects = InferSubjects<typeof User> | ResourcePermission;
export type AppAbility = PureAbility<[ActionPermission, Subjects]>;

@Injectable()
export class AbilityFactory {
  definePoliciesForUser(user: IUserSession) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user?.username === process.env.ROOT_USER_NAME) {
      can(ActionPermission.manage, SYSTEM_RESOURCE.all);
    } else {
      //reject or grant permissions based on user's policies
      // user.policies.forEach((policy) => {
      //   const [action, dataSource, resource] = decodePolicy(policy);
      //   can(action, `${dataSource}:${resource}`);
      // });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
