import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JsonResponse } from 'src/common/JsonResponse';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: any) {
    const payload = await this.authService.login(request.user);
    const response: JsonResponse<typeof payload> = {
      statusCode: 200,
      message: 'OK',
      data: payload,
    };

    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() request: CreateUserDto) {
    const data = await this.authService.register(request);
    const response: JsonResponse<typeof data> = {
      statusCode: 201,
      message: 'CREATED',
      data: data,
    };

    return response;
  }
}
