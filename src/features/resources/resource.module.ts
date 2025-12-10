import { ContextModule } from '@common/modules/context';
import { LocatorResourceModule } from '@features/locator-resource';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability';
import { Resource } from './entities/resource.entity';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    AbilityModule,
    LocatorResourceModule,
    ContextModule,
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
