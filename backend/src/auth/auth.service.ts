import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';
import { User } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  login(phone: number, password: string) {
    if (phone < 99000 || phone > 99989)
      throw new UnauthorizedException('Bad phone');
    if (!password.trim())
      throw new UnauthorizedException('Bad password');

    const user = config.store.users.find((x) => x.phone === phone);
    if (!user || user.password !== password)
      throw new UnauthorizedException('Неверный номер или пароль');

    return this.jwt.sign({ phone });
  }

  refreshToken(user: User) {
    user.isAdmin = config.adminPhone === user.phone;
    return {
      user,
      token: this.jwt.sign({ phone: user.phone }),
      host: config.host,
      port: config.port,
      realm: config.realm,
    };
  }
}
