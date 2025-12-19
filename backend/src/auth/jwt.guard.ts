import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const h = String(req.headers.authorization || '');
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (!m) throw new UnauthorizedException('no_token');

    try {
      const payload = this.jwt.verify(m[1]);
      req.user = payload; // { sub, phone, iat, exp }
      return true;
    } catch {
      throw new UnauthorizedException('bad_token');
    }
  }
}
