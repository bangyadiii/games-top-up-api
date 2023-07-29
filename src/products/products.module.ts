import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CoinsService } from './coins/coins.service';
import { StorageModule } from 'src/Infrastructure/storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [ProductsService, CoinsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
