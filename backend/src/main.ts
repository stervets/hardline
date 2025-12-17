import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(urlencoded({ extended: false }));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
