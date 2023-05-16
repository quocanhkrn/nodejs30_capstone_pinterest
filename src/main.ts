import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(Express.static('.'));
  await app.listen(8080, () => console.log('Server is starting...'));
}
bootstrap();
