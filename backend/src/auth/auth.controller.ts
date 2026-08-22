import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { PublicUser } from '../users/users.service';
import { clearAuthCookie, setAuthCookie } from './auth-cookie';
import { AuthService } from './auth.service';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type RequestWithCookies = Request & {
  cookies?: Record<string, string | undefined>;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() input: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const result = await this.authService.register(input);
    setAuthCookie(response, result.token, this.configService, false);
    return { user: result.user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const result = await this.authService.login(input);
    setAuthCookie(response, result.token, this.configService, input.rememberMe);
    return { user: result.user };
  }

  @Get('me')
  async me(
    @Req() request: RequestWithCookies,
  ): Promise<{ user: PublicUser | null }> {
    const user = await this.authService.restoreSession(
      request.cookies?.[AUTH_COOKIE_NAME],
    );
    return { user };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): void {
    clearAuthCookie(response, this.configService);
  }
}
