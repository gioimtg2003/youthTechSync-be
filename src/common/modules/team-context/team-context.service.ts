import { CACHE_KEY_SYSTEM, REDIS_CACHE_TTL, TeamError } from '@constants';
import { RedisCacheService } from '@features/redis';
import { Team } from '@features/teams/entities/team.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { Repository } from 'typeorm';

interface Store {
  teamAlias: string;
  teamId: string;
}

@Injectable()
export class TeamContextService {
  private readonly als = new AsyncLocalStorage<Store>();

  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    private readonly cacheService: RedisCacheService,
  ) {}

  async run(team: string, callback: () => void) {
    let teamId = await this.cacheService.get(
      `${CACHE_KEY_SYSTEM.TEAM_ALIAS}:${team}`,
    );

    if (!teamId) {
      const teamEntity = await this.teamRepository.findOne({
        where: { alias: team },
        select: { id: true },
      });
      if (!teamEntity) throw new BadRequestException(TeamError.TEAM_NOT_FOUND);
      teamId = `${teamEntity.id}`;

      await this.cacheService.set({
        record: {
          key: `${CACHE_KEY_SYSTEM.TEAM_ALIAS}:${team}`,
          value: `${teamEntity.id}`,
        },
        expires: REDIS_CACHE_TTL.TEAM_ALIAS,
      });
    }

    this.als.run({ teamAlias: team, teamId }, callback);
  }

  get teamAlias(): string {
    return this.als.getStore()?.teamAlias;
  }

  get teamId(): number {
    return Number(this.als.getStore()?.teamId);
  }
}
