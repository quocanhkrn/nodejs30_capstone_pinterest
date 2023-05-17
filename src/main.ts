import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Express from 'express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  console.log(process.env.SECRET_KEY);
  const app = await NestFactory.create(AppModule);
  app.use(Express.static('.'));
  await app.listen(process.env.port, () =>
    console.log('Server is starting...'),
  );
}
bootstrap();
