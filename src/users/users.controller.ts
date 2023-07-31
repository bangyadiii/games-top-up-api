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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  @UseInterceptors(CacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async login(@Request() request: any) {
    return request.user;
  }
}
