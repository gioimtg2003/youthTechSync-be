import { TeamContextModule } from '@common/modules';
import { TeamContextService } from '@common/services';
import { SYSTEM_RESOURCE, VERSIONING_API } from '@constants';
import { PolicyModule } from '@features/policy';
import { PostAuditModule } from '@features/post-audits';
import { PostModule } from '@features/posts';
import { RedisModule } from '@features/redis';
import { ResourceModule } from '@features/resources';
import { RoleModule } from '@features/roles';
import { TeamModule } from '@features/teams';
import { UserAuthModule } from '@features/user-auth';
import { UserModule } from '@features/users';
import { UserTeamModule } from '@features/users/user-team';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { joinPath } from '@utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Environment } from './config';
import { TeamMiddleware } from './middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [`${__dirname}/**/*.entity.ts`],
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.NODE_ENV !== Environment.production,
      useUTC: true,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT,
      },
    }),
    SentryModule.forRoot(),
    RedisModule,
    ResourceModule,
    PostAuditModule,
    PostModule,
    RoleModule,
    TeamModule,
    UserModule,
    UserAuthModule,
    PolicyModule,
    UserTeamModule,
    TeamContextModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
    TeamContextService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const globalPrefix = '/api';
    const version = VERSIONING_API.v1;

    const fullPrefix = globalPrefix
      ? joinPath(globalPrefix, version)
      : joinPath(version);

    consumer
      .apply(TeamMiddleware)
      .exclude(
        {
          path: `${fullPrefix}/user-auth/*`,
          method: RequestMethod.ALL,
        },
        {
          path: `${fullPrefix}/${SYSTEM_RESOURCE.team}`,
          method: RequestMethod.POST,
        },
      )
      .forRoutes({
        path: `${fullPrefix}/*`,
        method: RequestMethod.ALL,
      });
  }
}
