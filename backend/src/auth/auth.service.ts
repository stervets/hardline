import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'node:fs';

type RegistryUser = { ext: number; sipPassword: string; name?: string };
type Registry = { users: RegistryUser[] };

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(phone: number, password: string) {
    if (phone < 99000 || phone > 99989)
      throw new UnauthorizedException('bad_phone');

    const reg = this.readRegistry();
    const u = reg.users.find((x) => x.ext === phone);
    if (!u || u.sipPassword !== password)
      throw new UnauthorizedException('bad_creds');

    // “обновляется месяц” = на каждый логин новый exp на 30d
    return this.jwt.sign({ phone });
  }

  private readRegistry(): Registry {
    // подстрой под твой путь/сервис. Сейчас просто минималка.
    return JSON.parse(readFileSync('./registry.json', 'utf-8'));
  }
}
