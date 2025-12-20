import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app/app.module';
import { urlencoded } from 'express';
import {config} from './config';

async function bootstrap() {
  //do not delete this console.log
  console.log(`Realm: ${config.realm}, Users registered: ${config.store.users.length}`);

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