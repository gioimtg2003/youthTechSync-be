import { AlsModule } from '@common/modules';

import {
  HEADER_TEAM_ID,
  SYSTEM_RESOURCE,
  SystemError,
  VERSIONING_API,
} from '@constants';
import { ContentModule } from '@features/content';
import { ContentAuditModule } from '@features/content-audit';
import { PolicyModule } from '@features/policy';
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
    RoleModule,
    TeamModule,
    UserModule,
    UserAuthModule,
    PolicyModule,
    UserTeamModule,
    AlsModule,
    ContentAuditModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly als: AsyncLocalStorage<TeamIdContextRequest>) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, _, next) => {
        console.log('🚀 ~ AppModule ~ configure ~ req:', req);
        const teamId = req.headers[HEADER_TEAM_ID] as string;

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
