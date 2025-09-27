import { SYSTEM_RESOURCE, SystemError } from '@constants';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RESOURCE_RESOLVER } from '../constants';
import { IResourceResolver } from './type';

@Injectable()
export class ResourceLocatorService {
  private logger = new Logger(ResourceLocatorService.name);

  constructor(
    @Inject(RESOURCE_RESOLVER)
    private readonly resolvers: IResourceResolver[],
  ) {}

  async getTeamIdForResource(resource: SYSTEM_RESOURCE, resourceId: number) {
    this.logger.log(`Get team id for resource ${resource}`);

    const resolver = this.resolvers.find((r) => r.supports(resource));

    if (!resolver) {
      this.logger.error(`No resolver found for resource ${resource}`);
      throw new InternalServerErrorException(SystemError.INTERNAL_SERVER_ERROR);
    }

    return resolver.getTeamId(resourceId);
  }
}
