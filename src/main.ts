import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Express from 'express';
import * as dotenv from 'dotenv';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(Express.static('public'));

  const config = new DocumentBuilder()
    .setTitle('CAPSTONE NODEJS - PINTEREST PROJECT')
    .setDescription(`By DANG QUOC ANH - NODEJS30`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.port, () =>
    console.log('Server is starting...'),
  );
}
bootstrap();
