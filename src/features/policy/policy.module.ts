import { AlsModule, TeamContextService } from '@common/modules';
import { UserTeamModule } from '@features/users/user-team';
import { Module } from '@nestjs/common';
import { AbilityModule } from 'src/ability';
import { PolicyResourcesService } from './policy-resouces.service';
import { PolicyResourcesController } from './policy-resources.controller';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';

@Module({
  imports: [AbilityModule, UserTeamModule, AlsModule],
  controllers: [PolicyController, PolicyResourcesController],
  providers: [PolicyService, PolicyResourcesService, TeamContextService],
  exports: [],
})
export class PolicyModule {}
