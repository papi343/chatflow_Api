import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const authHeader = client.handshake?.headers?.authorization;
    const token = client.handshake?.auth?.token || (authHeader ? authHeader.split(' ')[1] : null);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    try {
      const payload = this.jwt.verify(token);
      client.data.user = { id: payload.sub, username: payload.username };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}