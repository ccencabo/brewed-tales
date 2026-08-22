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
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { PublicUser } from '../users/users.service';
import { CreateSavedBookDto } from './dto/create-saved-book.dto';
import type { LibraryItem, SavedBookLibraryItem } from './library.presenter';
import { LibraryService } from './library.service';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  findAll(@CurrentUser() user: PublicUser): Promise<LibraryItem[]> {
    return this.libraryService.findAll(user.id);
  }

  @Post('books')
  saveBook(
    @Body() input: CreateSavedBookDto,
    @CurrentUser() user: PublicUser,
  ): Promise<SavedBookLibraryItem> {
    return this.libraryService.saveBook(user.id, input);
  }

  @Delete('books/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBook(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<void> {
    return this.libraryService.removeSavedBook(id, user.id);
  }

  @Delete('shelf-matches/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeShelfMatch(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<void> {
    return this.libraryService.removeShelfMatch(id, user.id);
  }
}
