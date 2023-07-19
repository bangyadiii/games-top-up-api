import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: PrismaService) {}

  async createProduct(payload: CreateProductDto) {
    return await this.dbService.product.create({
      data: {
        coinName: payload.coinName,
        price: payload.price,
        coinQuantity: payload.coinQuantity,
        gameId: payload.gameId,
      },
    });
  }

  async getProducts(): Promise<Product[]> {
    return await this.dbService.product.findMany({
      include: {
        game: true,
      },
    });
  }

  async findProductById(id: string): Promise<Product> {
    return await this.dbService.product.findUnique({
      where: {
        id: id,
      },
      include: {
        game: true,
      },
    });
  }
}
