import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisClientOptions } from 'redis';
import { ProductsModule } from './products/products.module';
import { GamesModule } from './games/games.module';
import { CoinsService } from './products/coins/coins.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductsModule,
    GamesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      // store: redisStore, // TODO: use Redis to store the cache
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    CoinsService,
  ],
})
export class AppModule {}
