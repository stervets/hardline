import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/types';
import { config, saveStore } from 'src/config';

@Injectable()
export class AppService {
  usersList(user: User) {
    const users = structuredClone(config.store.users).sort(
      (a, b) => a.phone - b.phone,
    );
    !user.isAdmin &&
      users.forEach((u) => {
        user.phone !== u.phone && (u.password = '');
      });
    return users;
  }

  addUser(user: User, newUser: User) {
    if (!user.isAdmin) throw new UnauthorizedException('admin access required');
    if (config.store.users.find((u) => u.phone === newUser.phone))
      throw new BadRequestException('user exists');
    config.store.users.push(newUser);
    saveStore();
    return true;
  }

  delUser(user: User, delUser: User) {
    if (!user.isAdmin) throw new UnauthorizedException('admin access required');
    delUser = config.store.users.find((u) => u.phone === delUser.phone) as User;
    if (!delUser) throw new BadRequestException('user not found');
    if (delUser.phone === user.phone)
      throw new BadRequestException("can't delete yourself");
    config.store.users.splice(config.store.users.indexOf(delUser), 1);
    saveStore();
    return true;
  }

  editUser(user: User, editUser: User) {
    if (!user.isAdmin) throw new UnauthorizedException('admin access required');
    const storedUser = config.store.users.find(
      (u) => u.phone === editUser.phone,
    ) as User;
    if (!storedUser) throw new BadRequestException('user not found');
    editUser.password = (editUser.password || '').trim();
    editUser.name = (editUser.name || '').trim();
    if (!editUser.password)
      throw new BadRequestException("password can't be empty");
    if (!editUser.name) throw new BadRequestException("name can't be empty");
    Object.assign(storedUser, editUser);
    saveStore();
    return true;
  }
}
