import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameCategoryDTO } from '../dto/create-game-category';

@Injectable()
export class CategoryService {
  constructor(private readonly dbservice: PrismaService) {}

  async createGameCategory(data: CreateGameCategoryDTO) {
    const category = await this.dbservice.gameCategory.create({
      data: {
        ...data,
      },
    });

    return category;
  }
}
