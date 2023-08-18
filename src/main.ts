import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config as dotenvInit } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomValidationFormatPipe } from './common/pipes/custom-validation-format.pipe';
import { useContainer } from 'class-validator';
import { Logger } from '@nestjs/common';
import { JwtExceptionFilter } from './common/filter/jwt-exception.filter';

dotenvInit();

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // DTO auto validation
  app.useGlobalPipes(new CustomValidationFormatPipe());
  app.useLogger(logger);
  app.useGlobalFilters(new JwtExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Clinician API')
    .setDescription('Clinician api documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(3000);
}

bootstrap();
