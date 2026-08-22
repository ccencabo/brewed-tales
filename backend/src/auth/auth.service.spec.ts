import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  argon2id: 2,
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  const user = {
    id: 42,
    email: 'reader@example.com',
    displayName: 'Reader',
    createdAt: new Date('2026-08-22T00:00:00.000Z'),
  };
  const usersService = {
    createWithPassword: jest.fn(),
    findCredentialsByEmail: jest.fn(),
    findById: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const service = new AuthService(
    usersService as unknown as UsersService,
    jwtService as unknown as JwtService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hashes a password before creating a user', async () => {
    jest.mocked(argon2.hash).mockResolvedValue('argon-hash');
    usersService.createWithPassword.mockResolvedValue(user);
    jwtService.signAsync.mockResolvedValue('signed-token');

    const result = await service.register({
      email: user.email,
      displayName: user.displayName,
      password: 'tea-and-books-123',
    });

    expect(usersService.createWithPassword).toHaveBeenCalledWith({
      email: user.email,
      displayName: user.displayName,
      passwordHash: 'argon-hash',
    });
    expect(result).toEqual({ token: 'signed-token', user });
  });

  it('returns a session for valid credentials without exposing the hash', async () => {
    usersService.findCredentialsByEmail.mockResolvedValue({
      ...user,
      passwordHash: 'argon-hash',
    });
    jest.mocked(argon2.verify).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('signed-token');

    const result = await service.login({
      email: user.email,
      password: 'tea-and-books-123',
      rememberMe: false,
    });

    expect(result).toEqual({ token: 'signed-token', user });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('returns no current user when there is no session token', async () => {
    await expect(service.restoreSession()).resolves.toBeNull();
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('restores the current user from a valid session token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ sub: user.id });
    usersService.findById.mockResolvedValue(user);

    await expect(service.restoreSession('valid-token')).resolves.toEqual(user);
    expect(usersService.findById).toHaveBeenCalledWith(user.id);
  });

  it('returns no current user for an invalid session token', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    await expect(service.restoreSession('invalid-token')).resolves.toBeNull();
  });
});
