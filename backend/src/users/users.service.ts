import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export const publicUserSelect = {
  id: true,
  email: true,
  displayName: true,
  createdAt: true,
} as const;

export type PublicUser = {
  id: number;
  email: string;
  displayName: string;
  createdAt: Date;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  findCredentialsByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        ...publicUserSelect,
        passwordHash: true,
      },
    });
  }

  async createWithPassword(input: {
    email: string;
    displayName: string;
    passwordHash: string;
  }): Promise<PublicUser> {
    try {
      return await this.prisma.user.create({
        data: input,
        select: publicUserSelect,
      });
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }
      throw error;
    }
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
