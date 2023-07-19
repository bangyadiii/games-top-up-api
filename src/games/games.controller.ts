import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDTO } from './dto/create-game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}
  @UseInterceptors(CacheInterceptor)
  @Get('/')
  async getGames() {
    return await this.gameService.getGames();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createGame(@Body() data: CreateGameDTO) {
    return await this.gameService.createGame(data);
  }
}
