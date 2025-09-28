import {
  ActionPermission,
  SEPARATOR_POLICY,
  SYSTEM_RESOURCE,
} from '@constants';
import { IUserSession } from '@interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { parserPolicy } from '@utils';

export const PolicyIds = createParamDecorator(
  (resource: SYSTEM_RESOURCE, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.session?.user as IUserSession;

    if (!user?.permissions) return null;

    const matched = (user?.permissions ?? [])?.find((p) =>
      p.startsWith(`${ActionPermission.read}${SEPARATOR_POLICY}${resource}`),
    );
    if (!matched) return null;

    const { resourceIds } = parserPolicy(matched);

    return resourceIds?.length ? resourceIds : null;
  },
);
