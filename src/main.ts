import { CURRENT_VERSION_API } from '@constants';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import RedisStore from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { buildConfig } from './config';
import { genId } from './gen-id';
import './instrument';

const appConfig = buildConfig();

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;
  logger.debug(
    `🔥 Application listening on http://localhost:${PORT}/api/v${CURRENT_VERSION_API}`,
  );
  if (appConfig.enableSwagger)
    logger.debug(`🔥 Swagger running on http://localhost:${PORT}/api/doc`);

  app.setGlobalPrefix('api');
  // app.useGlobalInterceptors(new TransformationInterceptor());
  const redisClient = new Redis(process.env.REDIS_URI);

  redisClient.on('connect', () => {
    logger.debug('Redis client connected');
  });

  const redisStore = new (RedisStore(session))({
    client: redisClient,
  });
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { ...appConfig.cookie },
      genid: genId,
    }),
  );

  app.set('trust proxy', 1);

  if (appConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Youth TechSync API')
      .setDescription('The Youth TechSync API description')
      .setVersion(version)
      .setBasePath('api')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api/docs', app, document);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: appConfig.origin,
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
