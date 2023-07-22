import {
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
  Body,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JsonResponse } from 'src/common/JsonResponse';
import { CreateCoinDTO as CreateCoinDto } from './dto/create-coin';
import { CoinsService } from './coins/coins.service';
import { AdminRoleGuard } from 'src/auth/admin-role/admin-role.guard';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly productTypeService: CoinsService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/')
  async getProducts() {
    const data = await this.productService.getProducts();
    const response: JsonResponse<typeof data> = {
      statusCode: 200,
      message: 'OK',
      data: data,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/')
  async createProduct(@Body() payload: CreateProductDto) {
    const data = await this.productService.createProduct(payload);
    const response: JsonResponse<typeof data> = {
      statusCode: 200,
      message: 'OK',
      data: data,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Put('/')
  async updateProduct(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
  ) {
    const data = await this.productService.updateProduct(id, payload);
    const response: JsonResponse<typeof data> = {
      statusCode: 200,
      message: 'OK',
      data: data,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/types')
  async createProductType(@Body() payload: CreateCoinDto) {
    const data = await this.productTypeService.createCoin(payload);
    const response: JsonResponse<typeof data> = {
      statusCode: 200,
      message: 'OK',
      data: data,
    };
    return response;
  }
}
