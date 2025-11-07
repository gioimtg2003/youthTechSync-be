import { PolicyHandler, REQUIRE_POLICIES_KEY } from '@decorators';
import { IUserSession } from '@interfaces';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AbilityFactory } from 'src/ability';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        REQUIRE_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request?.session?.user as IUserSession;

    const ability = this.abilityFactory.definePoliciesForUser(user);
    return policyHandlers.every((handler) =>
      typeof handler === 'function'
        ? handler(ability)
        : handler.handle(ability),
    );
  }
}
