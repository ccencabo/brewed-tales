import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ShelfListingsController } from './shelf-listings.controller';
import { ShelfListingsService } from './shelf-listings.service';

@Module({
  imports: [AuthModule],
  controllers: [ShelfListingsController],
  providers: [ShelfListingsService],
})
export class ShelfListingsModule {}
