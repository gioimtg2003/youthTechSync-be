import { ContextModule } from '@common/modules/context';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), ContextModule],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
