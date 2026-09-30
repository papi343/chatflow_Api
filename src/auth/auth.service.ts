import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const exist = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (exist) {
      throw new UnauthorizedException('User already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
      },
    });

    return this.buildToken(user.id, user.username);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const exist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!exist) {
      throw new UnauthorizedException('User not found');
    }
    const match = await bcrypt.compare(password, exist.password);
    if (match) {
      return this.buildToken(exist.id, exist.username);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private buildToken(userId: string, username: string) {
    const payload = { sub: userId, username };
    return { access_token: this.jwt.sign(payload) };
  }
}
