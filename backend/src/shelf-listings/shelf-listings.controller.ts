import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { PublicUser } from '../users/users.service';
import { ClaimShelfListingDto } from './dto/claim-shelf-listing.dto';
import { CreateShelfListingDto } from './dto/create-shelf-listing.dto';
import { ListShelfListingsQueryDto } from './dto/list-shelf-listings-query.dto';
import {
  presentShelfListing,
  type ShelfListingResponse,
} from './shelf-listing.presenter';
import { ShelfListingsService } from './shelf-listings.service';

@Controller('shelf-listings')
@UseGuards(JwtAuthGuard)
export class ShelfListingsController {
  constructor(private readonly shelfListingsService: ShelfListingsService) {}

  @Get()
  async findAll(
    @Query() query: ListShelfListingsQueryDto,
    @CurrentUser() user: PublicUser,
  ): Promise<ShelfListingResponse[]> {
    const listings = await this.shelfListingsService.findAll(query);
    return listings.map((listing) => presentShelfListing(listing, user.id));
  }

  @Post()
  async create(
    @Body() input: CreateShelfListingDto,
    @CurrentUser() user: PublicUser,
  ): Promise<ShelfListingResponse> {
    const listing = await this.shelfListingsService.create(user.id, input);
    return presentShelfListing(listing, user.id);
  }

  @Post(':id/claim')
  claim(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: ClaimShelfListingDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.shelfListingsService.claim(id, user.id, input);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<ShelfListingResponse> {
    const listing = await this.shelfListingsService.findOne(id);
    return presentShelfListing(listing, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<void> {
    return this.shelfListingsService.remove(id, user.id);
  }
}
