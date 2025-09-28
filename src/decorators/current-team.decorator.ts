import { TeamError } from '@constants';
import { createParamDecorator, NotFoundException } from '@nestjs/common';

export const CurrentTeam = createParamDecorator((_: unknown, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const teamId =
    request?.query?.teamId ||
    request?.body?.teamId ||
    request?.headers?.['x-team-id'];

  if (!teamId) {
    throw new NotFoundException(TeamError.TEAM_NOT_FOUND);
  }
  return teamId;
});
