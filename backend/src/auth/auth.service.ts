import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  login(phone: number, password: string) {
    if (phone < 99000 || phone > 99989)
      throw new UnauthorizedException('Bad phone');

    const user = config.store.users.find((x) => x.phone === phone);
    if (!user || user.password !== password)
      throw new UnauthorizedException('Неверный номер или пароль');

    return this.jwt.sign({ phone });
  }

  refreshToken(phone: number) {
    const user = config.store.users.find((x) => x.phone === phone);
    if (!user) throw new UnauthorizedException('Номер не найден');
    user.isAdmin = config.adminPhone === user.phone;
    return { user, token: this.jwt.sign({ phone }) };
  }
}
