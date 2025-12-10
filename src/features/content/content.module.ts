import { AlsModule } from '@common/modules';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), AlsModule],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
