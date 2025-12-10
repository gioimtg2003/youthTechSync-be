import { ContentModule } from '@features/content';
import { Module } from '@nestjs/common';
import { RESOURCE_RESOLVER } from './constants';
import { PostResolver, ResourceLocatorService, TeamResolver } from './resolver';

/**
 * This module is handle team resource locator
 */
@Module({
  imports: [ContentModule],
  providers: [
    ResourceLocatorService,
    TeamResolver,
    PostResolver,
    {
      provide: RESOURCE_RESOLVER,
      useFactory(teamResolver, postResolver) {
        return [teamResolver, postResolver];
      },
      inject: [TeamResolver, PostResolver],
    },
  ],
  exports: [ResourceLocatorService],
})
export class LocatorResourceModule {}
