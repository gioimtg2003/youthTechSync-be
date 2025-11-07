import { AlsModule, TeamContextService } from '@common/modules';

import {
  HEADER_TEAM_ID,
  SYSTEM_RESOURCE,
  SystemError,
  VERSIONING_API,
} from '@constants';
import { PolicyModule } from '@features/policy';
import { PostAuditModule } from '@features/post-audits';
import { PostModule } from '@features/posts';
import { RedisModule } from '@features/redis';
import { ResourceModule } from '@features/resources';
import { RoleModule } from '@features/roles';
import { TeamModule } from '@features/teams';
import { Team } from '@features/teams/entities/team.entity';
import { UserAuthModule } from '@features/user-auth';
import { UserModule } from '@features/users';
import { UserTeamModule } from '@features/users/user-team';
import { TeamIdContextRequest } from '@interfaces';
import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AsyncLocalStorage } from 'async_hooks';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Environment } from './config';

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
    TypeOrmModule.forFeature([Team]),
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
    AlsModule,
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
  constructor(private readonly als: AsyncLocalStorage<TeamIdContextRequest>) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, _, next) => {
        const teamId = req.headers[HEADER_TEAM_ID] as string;
        console.log('🚀 ~ TeamMiddleware ~ use ~ teamId:', teamId);

        if (!teamId || isNaN(Number(teamId))) {
          throw new BadRequestException(SystemError.REQUIRED__HEADER_TEAM_ID);
        }
        this.als.run(
          {
            teamId: Number(teamId),
          },
          () => next(),
        );
      })
      .exclude(
        {
          path: 'user-auth/(.*)',
          method: RequestMethod.POST,
          version: VERSIONING_API.v1,
        },
        {
          path: `${SYSTEM_RESOURCE.user}/me`,
          method: RequestMethod.GET,
          version: VERSIONING_API.v1,
        },
        {
          path: SYSTEM_RESOURCE.team,
          method: RequestMethod.GET,
          version: VERSIONING_API.v1,
        },
        {
          path: SYSTEM_RESOURCE.team,
          method: RequestMethod.POST,
          version: VERSIONING_API.v1,
        },
        {
          path: SYSTEM_RESOURCE.policy,
          method: RequestMethod.GET,
          version: VERSIONING_API.v1,
        },
      )
      .forRoutes('*');
  }
}
