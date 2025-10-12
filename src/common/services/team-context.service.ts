import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface Store {
  team: string;
}

@Injectable()
export class TeamContextService {
  private readonly als = new AsyncLocalStorage<Store>();

  run(team: string, callback: () => void) {
    this.als.run({ team }, callback);
  }

  get teamAlias(): string {
    return this.als.getStore()?.team;
  }
}
