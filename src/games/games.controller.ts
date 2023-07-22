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
import { JsonResponse } from 'src/common/JsonResponse';
import { AdminRoleGuard } from 'src/auth/admin-role/admin-role.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}
  @UseInterceptors(CacheInterceptor)
  @UseGuards(AdminRoleGuard)
  @Get('/')
  async getGames() {
    const payload = await this.gameService.getGames();
    const response: JsonResponse<typeof payload> = {
      statusCode: 200,
      message: 'OK',
      data: payload,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/')
  async createGame(@Body() data: CreateGameDTO) {
    const payload = await this.gameService.createGame(data);
    const response: JsonResponse<typeof payload> = {
      statusCode: 201,
      message: 'CREATED',
      data: payload,
    };
    return response;
  }
}
