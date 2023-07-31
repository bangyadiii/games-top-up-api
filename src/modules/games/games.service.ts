import { Injectable, Inject, Logger, ConflictException } from '@nestjs/common';
import { Game } from '@prisma/client';
import { CreateGameDTO } from './dto/create-game.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateGameDTO } from './dto/update-game.dto';
import { StorageService } from 'src/Infrastructure/storage/storage.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    private readonly dbservice: PrismaService,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async createGame(data: CreateGameDTO) {
    const destFile = `game/${data.gameThumbnailPath.split('/')[2]}`;
    const filePath = await this.storageService.moveFile(
      data.gameThumbnailPath,
      destFile,
    );
    delete data.gameThumbnailPath;
    try {
      const game = await this.dbservice.game.create({
        data: {
          ...data,
          thumbnail: filePath.publicUrl,
        },
      });

      return game;
    } catch (error) {
      this.storageService.removeFile(filePath.path);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('Game Name is exist');
      }
      throw error;
    }
  }

  async getGames() {
    let game = await this.cacheService.get<Game[] | undefined>('games');
    if (!game) {
      game = await this.dbservice.game.findMany({
        include: {
          products: true,
          coins: true,
        },
      });
      await this.cacheService.set('games', game);
    }

    return game;
  }

  async getGameById(id: string) {
    let game = await this.cacheService.get<Game | undefined>(id);
    if (!game) {
      game = await this.dbservice.game.findUnique({
        where: {
          id: id,
        },
        include: {
          products: true,
          coins: true,
        },
      });
      await this.cacheService.set(id, game);
    }

    return game;
  }

  async updateGame(id: string, data: UpdateGameDTO) {
    const game = await this.dbservice.game.update({
      data: {
        ...data,
      },
      where: {
        id: id,
      },
    });

    return game;
  }
}
