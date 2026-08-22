import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';

@Module({
  imports: [AuthModule],
  controllers: [ExchangesController],
  providers: [ExchangesService],
})
export class ExchangesModule {}
