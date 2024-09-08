import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export let nestApp: INestApplication; // So that we can dynamically find current domain

async function bootstrap() {
  nestApp = await NestFactory.create(AppModule, { rawBody: true });
  nestApp.enableCors();
  nestApp.enableVersioning({ type: VersioningType.URI });
  nestApp.useGlobalPipes(new ValidationPipe());
  await nestApp.listen(3000);
}
bootstrap();
