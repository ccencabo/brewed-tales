import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import {
  AUTH_COOKIE_MAX_AGE_MS,
  AUTH_COOKIE_NAME,
} from './auth.constants';

function baseCookieOptions(configService: ConfigService): CookieOptions {
  return {
    httpOnly: true,
    secure: configService.get<string>('NODE_ENV') === 'production',
    sameSite: 'lax',
    path: '/',
  };
}

export function setAuthCookie(
  response: Response,
  token: string,
  configService: ConfigService,
  rememberMe: boolean,
): void {
  response.cookie(AUTH_COOKIE_NAME, token, {
    ...baseCookieOptions(configService),
    ...(rememberMe ? { maxAge: AUTH_COOKIE_MAX_AGE_MS } : {}),
  });
}

export function clearAuthCookie(
  response: Response,
  configService: ConfigService,
): void {
  response.clearCookie(AUTH_COOKIE_NAME, baseCookieOptions(configService));
}
