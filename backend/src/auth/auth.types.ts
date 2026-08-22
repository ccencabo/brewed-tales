import type { Request } from 'express';
import type { PublicUser } from '../users/users.service';

export interface AuthTokenPayload {
  sub: number;
}

export interface AuthenticatedRequest extends Request {
  user: PublicUser;
}
