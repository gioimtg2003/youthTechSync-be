import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface Store {
  teamId: number;
}

@Injectable()
export class TeamContextService {
  private readonly als = new AsyncLocalStorage<Store>();

  run(teamId: number, callback: () => void) {
    this.als.run({ teamId }, callback);
  }

  get teamId(): number {
    return this.als.getStore()?.teamId;
  }
}
