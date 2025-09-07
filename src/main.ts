import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { buildConfig } from './config';
import './instrument';

const appConfig = buildConfig();

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;

  app.setGlobalPrefix('api');
  // app.useGlobalInterceptors(new TransformationInterceptor());

  if (appConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Youth TechSync API')
      .setDescription('The Youth TechSync API description')
      .setVersion('1.0.0')
      .setBasePath('api')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api/docs', app, document);
  }

  logger.debug(`🔥 Application listening on http://localhost:${PORT}/api`);
  if (appConfig.enableSwagger)
    logger.debug(`🔥 Swagger running on http://localhost:${PORT}/api/doc`);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: appConfig.origin,
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
