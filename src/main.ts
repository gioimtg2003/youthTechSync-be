import { CURRENT_VERSION_API } from '@constants';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import passport from 'passport';
import { createClient } from 'redis';
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
    logger.debug(
      `🔥 Swagger running on http://localhost:${PORT}/api/v${CURRENT_VERSION_API}/docs`,
    );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // app.useGlobalInterceptors(new TransformationInterceptor());
  const redisClient = createClient({
    url: process.env.REDIS_URI,
    pingInterval: 15000,
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  await redisClient.connect();
  console.log(' \u2714 Connected to Redis');

  const store = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: appConfig.cookie.maxAge / 1000,
  });

  app.use(
    session({
      store,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false, //  only save session when data exists
      cookie: { ...appConfig.cookie },
      genid: genId,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.set('trust proxy', 1);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: appConfig.origin,
    credentials: true,
  });

  if (appConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Youth TechSync API')
      .setDescription('The Youth TechSync API description')
      .setVersion(`v${CURRENT_VERSION_API}`)
      .build();

    const document = SwaggerModule.createDocument(app, config, {});

    SwaggerModule.setup(`/api/v${CURRENT_VERSION_API}/docs`, app, document);
  }

  await app.listen(PORT);
}
bootstrap();
