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
  ) {}

  get(teamId: number, ids: number[] = []) {
    if (ids.length === 0) {
      return this.resourceRepository.find({
        where: { team: { id: teamId } },
      });
    }
    return this.resourceRepository.findBy({
      id: In(ids),
      team: { id: teamId },
    });
  }

  create() {}
}
