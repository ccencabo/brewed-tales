import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvironment } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { ShelfListingsModule } from './shelf-listings/shelf-listings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LibraryModule } from './library/library.module';
import { ExchangesModule } from './exchanges/exchanges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ShelfListingsModule,
    LibraryModule,
    ExchangesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
