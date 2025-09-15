import { SetMetadata } from '@nestjs/common';
import { AppAbility } from 'src/ability';

export const REQUIRE_POLICIES_KEY = 'require_policies';
interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = IPolicyHandler['handle'];
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const RequirePolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(REQUIRE_POLICIES_KEY, handlers);
