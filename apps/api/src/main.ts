/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@longucodes/promise';
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Employees API')
    .setDescription('API for managing the employee structure')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors();
  app.enableVersioning({
    extractor: (request: Request) => request.headers['version'] ?? '1',
    type: VersioningType.CUSTOM,
    defaultVersion: ['1', VERSION_NEUTRAL],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  swaggerSetup(app);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

void bootstrap();
