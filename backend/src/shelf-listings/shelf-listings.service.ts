import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ShelfListingStatus,
  ShelfMatchStatus,
} from '../generated/prisma/enums';
import { PrismaService } from '../database/prisma.service';
import { ListShelfListingsQueryDto } from './dto/list-shelf-listings-query.dto';
import { CreateShelfListingDto } from './dto/create-shelf-listing.dto';
import { ClaimShelfListingDto } from './dto/claim-shelf-listing.dto';

const publicListingQuery = {
  owner: {
    select: {
      id: true,
      displayName: true,
    },
  },
} as const;

@Injectable()
export class ShelfListingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListShelfListingsQueryDto) {
    return this.prisma.shelfListing.findMany({
      where: {
        status: query.status ?? ShelfListingStatus.AVAILABLE,
      },
      include: publicListingQuery,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  create(ownerId: number, input: CreateShelfListingDto) {
    return this.prisma.shelfListing.create({
      data: {
        ownerId,
        coverColor: input.coverColor,
        emoji: input.emoji,
        hook1: input.hooks[0],
        hook2: input.hooks[1],
        hook3: input.hooks[2],
        publicationYear: input.publicationYear,
        ingredients: input.ingredients,
        matchTags: [],
      },
      include: publicListingQuery,
    });
  }

  async findOne(id: number) {
    const listing = await this.prisma.shelfListing.findFirst({
      where: {
        id,
        status: {
          not: ShelfListingStatus.REMOVED,
        },
      },
      include: publicListingQuery,
    });

    if (!listing) {
      throw new NotFoundException('Shelf listing not found');
    }

    return listing;
  }

  async remove(id: number, ownerId: number): Promise<void> {
    const listing = await this.prisma.shelfListing.findUnique({
      where: { id },
      select: { ownerId: true, status: true },
    });

    if (!listing || listing.status === ShelfListingStatus.REMOVED) {
      throw new NotFoundException('Shelf listing not found');
    }
    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('Only the owner can remove this listing');
    }
    if (listing.status === ShelfListingStatus.MATCHED) {
      throw new ConflictException('A matched listing cannot be removed');
    }

    await this.prisma.shelfListing.update({
      where: { id },
      data: { status: ShelfListingStatus.REMOVED },
    });
  }

  claim(id: number, requesterId: number, input: ClaimShelfListingDto) {
    return this.prisma.$transaction(async (transaction) => {
      const listing = await transaction.shelfListing.findUnique({
        where: { id },
        include: {
          owner: {
            select: { id: true, displayName: true, email: true },
          },
        },
      });

      if (!listing || listing.status === ShelfListingStatus.REMOVED) {
        throw new NotFoundException('Shelf listing not found');
      }
      if (listing.ownerId === requesterId) {
        throw new ForbiddenException('You cannot match with your own book');
      }
      if (listing.status !== ShelfListingStatus.AVAILABLE) {
        throw new ConflictException('This book has already been matched');
      }

      const reserved = await transaction.shelfListing.updateMany({
        where: { id, status: ShelfListingStatus.AVAILABLE },
        data: { status: ShelfListingStatus.MATCHED },
      });
      if (reserved.count !== 1) {
        throw new ConflictException('This book has already been matched');
      }

      const match = await transaction.shelfMatch.create({
        data: {
          listingId: id,
          requesterId,
          preferenceTags: input.preferenceTags ?? [],
          status: ShelfMatchStatus.PENDING,
        },
      });

      return {
        id: match.id,
        listingId: listing.id,
        owner: {
          displayName: listing.owner.displayName,
        },
        status: 'pending' as const,
        createdAt: match.createdAt,
      };
    });
  }
}
