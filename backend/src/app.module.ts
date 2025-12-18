import { Module } from '@nestjs/common';
import { BootstrapController } from './bootstrap/bootstrap.controller';
import { DirectoryController } from './directory/directory.controller';
import { FreeSwitchController } from './freeswitch/freeswitch.controller';
import { AppController } from './app.controller';

@Module({
  controllers: [
    AppController, BootstrapController,
    DirectoryController,
    FreeSwitchController,
  ],
})
export class AppModule {}
