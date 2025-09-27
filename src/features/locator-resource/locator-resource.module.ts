import { PostModule } from '@features/posts';
import { TeamModule } from '@features/teams';
import { forwardRef, Module } from '@nestjs/common';
import { RESOURCE_RESOLVER } from './constants';
import { PostResolver, ResourceLocatorService, TeamResolver } from './resolver';

/**
 * This module is handle team resource locator
 */
@Module({
  imports: [forwardRef(() => TeamModule), forwardRef(() => PostModule)],
  providers: [
    ResourceLocatorService,
    TeamResolver,
    PostResolver,
    {
      provide: RESOURCE_RESOLVER,
      useFactory(a, b) {
        return [a, b];
      },
      inject: [TeamResolver, PostResolver],
    },
  ],
  exports: [ResourceLocatorService],
})
export class LocatorResourceModule {}
