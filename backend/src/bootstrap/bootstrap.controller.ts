import { Body, Controller, Post } from '@nestjs/common';
import { bootstrapUser } from './bootstrap.service';

@Controller()
export class BootstrapController {
  @Post('/bootstrap')
  bootstrap(@Body() body: any) {
    return bootstrapUser({
      serverPassword: body.serverPassword,
      displayName: body.displayName,
      password: body.password,
    });
  }
}
