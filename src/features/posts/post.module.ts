import { AlsModule } from '@common/modules';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.services';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AlsModule],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
