import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import type { RedisClientOptions } from 'redis';
import { ProductsModule } from './modules/products/products.module';
import { GamesModule } from './modules/games/games.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { MediasModule } from './modules/medias/medias.module';
import { StorageModule } from './Infrastructure/storage/storage.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    StorageModule,
    UserModule,
    AuthModule,
    ProductsModule,
    GamesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      // store: redisStore, // TODO: use Redis to store the cache
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000,
    }),
    EventEmitterModule.forRoot(),
    TransactionsModule,
    MediasModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
