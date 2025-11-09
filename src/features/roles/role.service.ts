import { TeamIdContextRequest } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly als: AsyncLocalStorage<TeamIdContextRequest>,
  ) {}

  async create() {}

  async findAll(ids: number[] = []) {
    if (ids?.length > 0) {
      return this.roleRepository.find({
        where: { id: In(ids), team: { id: this.als.getStore()?.teamId } },
        select: ['id', 'name', 'description'],
      });
    }
    return this.roleRepository.find({
      where: { team: { id: this.als.getStore()?.teamId } },
      select: ['id', 'name', 'description'],
    });
  }
}
