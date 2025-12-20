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
    const token = String(req.headers.token || '');
    if (!token) throw new UnauthorizedException('no token');

    try {
      req.phone = this.jwt.verify(token).phone;
      return true;
    } catch {
      throw new UnauthorizedException('bad token');
    }
  }
}
