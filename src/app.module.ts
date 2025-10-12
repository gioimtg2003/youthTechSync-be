import { TeamContextService } from '@common/services';
import { VERSIONING_API } from '@constants';
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
    consumer
      .apply(TeamMiddleware)
      .exclude({
        path: `/api/${VERSIONING_API.v1}/user-auth/(.*)`,
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
