import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  UseGuards,
  Get,
  Request,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() request: any) {
    return request.user;
  }
}
