import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentAudit } from './entities/post-audit.entity';

@Module({ imports: [TypeOrmModule.forFeature([ContentAudit])] })
export class ContentAuditModule {}
