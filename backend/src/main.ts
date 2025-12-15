import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initDb } from './db';

async function bootstrap() {
  initDb();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
