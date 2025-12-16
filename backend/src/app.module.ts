import { Module } from '@nestjs/common';
import { BootstrapController } from './bootstrap/bootstrap.controller';
import { DirectoryController } from './directory/directory.controller';
import { AriService } from './ari/ari.service';

@Module({
  controllers: [BootstrapController, DirectoryController],
  providers: [
    AriService,
    // ...
  ],
})
export class AppModule {}
