import { HEADER_TEAM_ID } from '@constants';
import { ApiSecurity } from '@nestjs/swagger';

export function HeaderTeamAlias() {
  return ApiSecurity(HEADER_TEAM_ID);
}
