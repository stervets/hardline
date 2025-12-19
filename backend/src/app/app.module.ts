import { Module } from '@nestjs/common';
import { BootstrapController } from '../bootstrap/bootstrap.controller';
import { DirectoryController } from '../directory/directory.controller';
import { FreeSwitchController } from '../freeswitch/freeswitch.controller';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    BootstrapController,
    DirectoryController,
    FreeSwitchController,
  ],
})
export class AppModule {}
