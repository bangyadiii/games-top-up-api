import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDTO } from './dto/create-game.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JsonResponse } from 'src/shared/Interfaces/JsonResponse';
import { AdminRoleGuard } from 'src/auth/admin-role/admin-role.guard';
import { CreateGameCategoryDTO } from './dto/create-game-category';
import { CategoryService } from './category/category.service';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gameService: GamesService,
    private readonly categoryService: CategoryService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getGames() {
    const payload = await this.gameService.getGames();
    const response: JsonResponse<typeof payload> = {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: payload,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createGame(@Body() data: CreateGameDTO) {
    const payload = await this.gameService.createGame(data);
    const response: JsonResponse<typeof payload> = {
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: payload,
    };
    return response;
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/categories')
  @HttpCode(HttpStatus.CREATED)
  async createGameCategory(@Body() data: CreateGameCategoryDTO) {
    const payload = await this.categoryService.createGameCategory(data);
    const response: JsonResponse<typeof payload> = {
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: payload,
    };
    return response;
  }
}
