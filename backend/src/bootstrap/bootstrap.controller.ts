import { Body, Controller, Post } from '@nestjs/common';
import { registerUser } from './bootstrap.service';

@Controller()
export class BootstrapController {
  @Post('/register')
  register(@Body() body: any) {
    return registerUser({
      displayName: body.displayName,
      sipPassword: body.sipPassword,
    });
  }
}
