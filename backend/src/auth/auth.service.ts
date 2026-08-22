import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PublicUser, UsersService } from '../users/users.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { AuthTokenPayload } from './auth.types';

export interface AuthResult {
  token: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterDto): Promise<AuthResult> {
    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });
    const user = await this.usersService.createWithPassword({
      email: input.email,
      displayName: input.displayName,
      passwordHash,
    });

    return this.createAuthResult(user);
  }

  async login(input: LoginDto): Promise<AuthResult> {
    const credentials = await this.usersService.findCredentialsByEmail(
      input.email,
    );

    if (!credentials?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let passwordMatches = false;
    try {
      passwordMatches = await argon2.verify(
        credentials.passwordHash,
        input.password,
      );
    } catch {
      passwordMatches = false;
    }

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { passwordHash: _passwordHash, ...user } = credentials;
    return this.createAuthResult(user);
  }

  async restoreSession(token?: string): Promise<PublicUser | null> {
    if (!token) return null;

    try {
      const payload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(token);
      if (!Number.isInteger(payload.sub)) return null;
      return await this.usersService.findById(payload.sub);
    } catch {
      return null;
    }
  }

  private async createAuthResult(user: PublicUser): Promise<AuthResult> {
    const token = await this.jwtService.signAsync({ sub: user.id });
    return { token, user };
  }
}
