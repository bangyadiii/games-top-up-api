import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma, Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { StorageService } from 'src/Infrastructure/storage/storage.service';
import { File } from 'src/shared/Interfaces/file.interface';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dbService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async createProduct(payload: CreateProductDto) {
    return await this.dbService.product.create({
      data: {
        ...payload,
      },
    });
  }

  async updateProduct(id: string, payload: UpdateProductDto) {
    return await this.dbService.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id: id,
        },
      });
      if (!product) {
        throw new NotFoundException();
      }

      const data = await tx.product.update({
        where: {
          id: id,
          updatedAt: product.updatedAt, // optimistic concurrency control. see: https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control
        },
        data: { ...payload },
      });
      return data;
    });
  }

  async deleteProduct(id: string) {
    const data = await this.dbService.product.delete({
      where: {
        id: id,
      },
    });
    await this.cacheService.del(`product-${id}`);
    return data;
  }

  async getProducts(): Promise<Product[]> {
    let data = await this.cacheService.get<Product[] | undefined>('products');
    if (!data) {
      data = await this.dbService.product.findMany({
        include: {
          game: true,
          coin: true,
        },
      });
      await this.cacheService.set('products', data);
    }
    return data;
  }

  async findProductById(id: string): Promise<Product> {
    let data = await this.cacheService.get<Product | undefined>(
      `product-${id}`,
    );
    if (!data) {
      data = await this.dbService.product.findUnique({
        where: {
          id: id,
        },
        include: {
          game: true,
          coin: true,
        },
      });
      await this.cacheService.set(`product-${id}`, data);
    }
    return data;
  }
}
