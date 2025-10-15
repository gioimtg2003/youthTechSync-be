import { ApiSecurity } from '@nestjs/swagger';

export function HeaderTeamAlias() {
  return ApiSecurity('x-team-alias');
}
