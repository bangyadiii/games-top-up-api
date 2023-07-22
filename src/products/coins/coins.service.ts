import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoinDTO } from '../dto/create-coin';

@Injectable()
export class CoinsService {
  constructor(private readonly dbService: PrismaService) {}

  async createCoin(payload: CreateCoinDTO) {
    delete payload.coinIconBase64;
    return await this.dbService.coin.create({
      data: {
        ...payload,
        coinIconUrl: 'adasdasdasdas',
      },
    });
  }
}
