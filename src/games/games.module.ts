import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GamesController } from './games.controller';

@Module({
  imports: [PrismaModule],
  providers: [GamesService],
  exports: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
