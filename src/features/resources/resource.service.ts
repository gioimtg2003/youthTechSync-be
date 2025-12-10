import { ContextService } from '@common/modules/context';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private readonly contextService: ContextService,
  ) {}

  get(_: number, ids: number[] = []) {
    const teamIdFromContext = this.contextService.getData('tenantId');
    if (ids.length === 0) {
      return this.resourceRepository.find({
        where: { team: { id: teamIdFromContext } },
      });
    }
    return this.resourceRepository.findBy({
      id: In(ids),
      team: { id: teamIdFromContext },
    });
  }

  findAll(ids: number[] = [], selectFields: (keyof Resource)[] = []) {
    if (ids.length === 0) {
      return this.resourceRepository.find({
        where: { team: { id: this.contextService.getData('tenantId') } },
        select: ['id', 'name', ...selectFields],
      });
    }

    return this.resourceRepository.find({
      where: {
        id: In(ids),
        team: { id: this.contextService.getData('tenantId') },
      },
      select: ['id', 'name', ...selectFields],
    });
  }

  create() {}
}
