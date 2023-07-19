import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/')
  async getProducts() {
    return await this.productService.getProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createProduct(payload: CreateProductDto) {
    return await this.productService.createProduct(payload);
  }
}
