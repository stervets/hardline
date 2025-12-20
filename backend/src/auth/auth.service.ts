import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(phone: number, password: string) {
    if (phone < 99000 || phone > 99989)
      throw new UnauthorizedException('Bad phone');

    const user = config.store.users.find((x) => x.phone === phone);
    if (!user || user.password !== password)
      throw new UnauthorizedException('Неверное имя пользователя или пароль');

    return this.jwt.sign({ phone });
  }
}
