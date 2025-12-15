import { Module } from '@nestjs/common';
import { BootstrapController } from './bootstrap/bootstrap.controller';

@Module({
  controllers: [BootstrapController],
})
export class AppModule {}
