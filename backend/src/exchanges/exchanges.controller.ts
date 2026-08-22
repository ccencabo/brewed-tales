import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { PublicUser } from '../users/users.service';
import type { ExchangeResponse } from './exchange.presenter';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
@UseGuards(JwtAuthGuard)
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Get()
  findAll(@CurrentUser() user: PublicUser): Promise<ExchangeResponse[]> {
    return this.exchangesService.findAll(user.id);
  }

  @Post(':id/accept')
  accept(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<ExchangeResponse> {
    return this.exchangesService.accept(id, user.id);
  }

  @Post(':id/decline')
  decline(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<ExchangeResponse> {
    return this.exchangesService.decline(id, user.id);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<ExchangeResponse> {
    return this.exchangesService.cancel(id, user.id);
  }

  @Post(':id/complete')
  complete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: PublicUser,
  ): Promise<ExchangeResponse> {
    return this.exchangesService.complete(id, user.id);
  }
}
