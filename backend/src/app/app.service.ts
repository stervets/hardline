import { Injectable } from '@nestjs/common';
import { User } from 'src/types';
import { config, saveStore } from 'src/config';

@Injectable()
export class AppService {
  addUser(user: User) {
    if (config.store.users.find((u) => u.phone === user.phone)) return false;
    config.store.users.push(user);
    saveStore();
    return true;
  }
}
