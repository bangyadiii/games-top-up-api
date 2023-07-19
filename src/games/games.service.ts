import { Injectable, Inject } from '@nestjs/common';
import { Game } from '@prisma/client';
import { CreateGameDTO } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GamesService {
  constructor(
    private readonly dbservice: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async createGame(data: CreateGameDTO) {
    const game = await this.dbservice.game.create({
      data: {
        name: data.name,
        thumbnail: data.thumbnail,
      },
    });

    return game;
  }

  async getGames() {
    let game = await this.cacheService.get<Game[] | undefined>('games');
    if (!game) {
      game = await this.dbservice.game.findMany({
        include: {
          products: true,
        },
      });
      await this.cacheService.set('games', game);
    }

    return game;
  }

  async getGameById(id: string) {
    let game = await this.cacheService.get<Game | undefined>(id.toString());
    if (!game) {
      game = await this.dbservice.game.findUnique({
        where: {
          id: id,
        },
        include: {
          products: true,
        },
      });
      await this.cacheService.set(id.toString(), game);
    }

    return game;
  }
}
