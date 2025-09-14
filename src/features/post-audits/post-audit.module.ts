import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostAudit } from './entities/post-audit.entity';

@Module({ imports: [TypeOrmModule.forFeature([PostAudit])] })
export class PostAuditModule {}
