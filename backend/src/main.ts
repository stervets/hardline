import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((_, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use(urlencoded({ extended: false }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();