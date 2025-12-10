import { ContextService } from '@common/modules/context';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly contextService: ContextService,
  ) {}

  async create() {}

  async findAll(ids: number[] = []) {
    if (ids?.length > 0) {
      return this.roleRepository.find({
        where: {
          id: In(ids),
          team: { id: this.contextService.getData('tenantId') },
        },
        select: ['id', 'name', 'description'],
      });
    }
    return this.roleRepository.find({
      where: { team: { id: this.contextService.getData('tenantId') } },
      select: ['id', 'name', 'description'],
    });
  }
}
