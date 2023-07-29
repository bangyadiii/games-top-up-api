import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GamesController } from './games.controller';
import { CategoryService } from './category/category.service';
import { StorageModule } from 'src/Infrastructure/storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  providers: [GamesService, CategoryService],
  exports: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
