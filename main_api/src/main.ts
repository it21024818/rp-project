import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export let nestApp: INestApplication; // So that we can dynamically find current domain

async function bootstrap() {
  nestApp = await NestFactory.create(AppModule);
  await nestApp.listen(3000);
}
bootstrap();
