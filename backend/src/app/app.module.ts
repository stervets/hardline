import { Module } from '@nestjs/common';
import { FreeSwitchController } from '../freeswitch/freeswitch.controller';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from 'src/app/app.service';

@Module({
  imports: [AuthModule],
  providers: [AppService],
  controllers: [AppController, FreeSwitchController],
})
export class AppModule {}
