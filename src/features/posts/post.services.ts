import { TeamIdContextRequest } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly als: AsyncLocalStorage<TeamIdContextRequest>,
  ) {}

  async findAll(ids: number[] = []) {
    if (ids?.length > 0) {
      return this.postRepository.find({
        where: { id: In(ids), team: { id: this.als.getStore()?.teamId } },
        select: ['id', 'title', 'content'],
      });
    }
    return this.postRepository.find({
      where: { team: { id: this.als.getStore()?.teamId } },
      select: ['id', 'title', 'content'],
    });
  }

  async findById(id: number) {
    return this.postRepository.findOne({
      where: { id, team: { id: this.als.getStore()?.teamId } },
      relations: ['team'],
    });
  }

  async getTeamId(id: number): Promise<number | null> {
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    queryBuilder.select('post.teamId').where('post.id = :id', { id });

    const result = await queryBuilder.getOne();

    return (result as unknown as { teamId: number })?.teamId ?? null;
  }
}
