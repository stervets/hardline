import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { config } from '../config';
import { type Request, type User } from 'src/types';
import { AppService } from 'src/app/app.service';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get()
  index() {
    return `ok\n`;
  }

  @UseGuards(JwtGuard)
  @Post('/users/list')
  usersList(@Req() { user }: Request, @Body() args: any) {
    return this.app.usersList(user);
  }

  @UseGuards(JwtGuard)
  @Post('/users/add')
  addUser(@Req() { user }: Request, @Body() [newUser]: [User]) {
    return this.app.addUser(user, newUser);
  }

  @UseGuards(JwtGuard)
  @Post('/users/del')
  delUser(@Req() { user }: Request, @Body() [delUser]: [User]) {
    return this.app.delUser(user, delUser);
  }

  @UseGuards(JwtGuard)
  @Post('/users/edit')
  editUser(@Req() { user }: Request, @Body() [editUser]: [User]) {
    return this.app.editUser(user, editUser);
  }
}
