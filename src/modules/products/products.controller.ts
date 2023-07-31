import {
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
  Body,
  Param,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JsonResponse } from 'src/shared/Interfaces/JsonResponse';
import { CreateCoinDTO as CreateCoinDto } from './dto/create-coin';
import { CoinsService } from './coins/coins.service';
import { AdminRoleGuard } from 'src/modules/auth/admin-role/admin-role.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(
    private readonly productService: ProductsService,
    private readonly productTypeService: CoinsService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getProducts() {
    const data = await this.productService.getProducts();
    const response: JsonResponse<typeof data> = {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() payload: CreateProductDto) {
    const data = await this.productService.createProduct(payload);
    const response: JsonResponse<typeof data> = {
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: data,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Put('/')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
  ) {
    const data = await this.productService.updateProduct(id, payload);
    const response: JsonResponse<typeof data> = {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/coins')
  @HttpCode(HttpStatus.CREATED)
  async createProductType(@Body() payload: CreateCoinDto) {
    const data = await this.productTypeService.createCoin(payload);
    const response: JsonResponse<typeof data> = {
      statusCode: HttpStatus.CREATED,
      message: 'CREATED',
      data: data,
    };
    return response;
  }
}
