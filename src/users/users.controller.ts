import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  UseGuards,
  Get,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  @UseInterceptors(CacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async login(@Request() request: any) {
    return request.user;
  }
}
