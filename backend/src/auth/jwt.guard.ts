import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const token = String(req.headers.token || '');
    if (!token) throw new UnauthorizedException('no token');

    let phone: number;
    try {
      phone = this.jwt.verify(token).phone;
    } catch {
      throw new UnauthorizedException('bad token');
    }

    const user = config.store.users.find((x) => x.phone === phone);
    if (!user) throw new UnauthorizedException('user not found');
    user.isAdmin =  config.adminPhone === user.phone;
    req.user = user;
    return true;
  }
}
