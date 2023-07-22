import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CoinsService } from './coins/coins.service';

@Module({
  providers: [ProductsService, CoinsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
