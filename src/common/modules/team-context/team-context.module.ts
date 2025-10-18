import { RedisModule } from '@features/redis';
import { Team } from '@features/teams/entities/team.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamContextService } from './team-context.service';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Team])],
  providers: [TeamContextService],
  exports: [TeamContextService],
})
export class TeamContextModule {}
