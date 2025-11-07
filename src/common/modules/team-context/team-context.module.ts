import { Module } from '@nestjs/common';
import { TeamContextService } from './team-context.service';

@Module({
  imports: [],
  providers: [TeamContextService],
  exports: [TeamContextService],
})
export class TeamContextModule {}
