import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async findById(id: number) {
    return this.postRepository.findOne({
      where: { id },
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
