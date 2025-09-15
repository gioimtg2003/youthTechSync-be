import { Module } from '@nestjs/common';
import { AbilityModule } from 'src/ability';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';

@Module({
  imports: [AbilityModule],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [],
})
export class PolicyModule {}
