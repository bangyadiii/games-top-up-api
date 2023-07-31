import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCoinDTO } from '../dto/create-coin';
import { StorageService } from 'src/Infrastructure/storage/storage.service';

@Injectable()
export class CoinsService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async createCoin(payload: CreateCoinDTO) {
    const destFile = `coins/${payload.coinFile.split('/')[2]}`;
    const filePath = await this.storageService.moveFile(
      payload.coinFile,
      destFile,
    );
    delete payload.coinFile;

    return await this.dbService.coin.create({
      data: {
        ...payload,
        coinIconUrl: filePath.publicUrl,
      },
    });
  }
}
