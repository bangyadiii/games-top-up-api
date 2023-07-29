import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { StorageService } from 'src/Infrastructure/storage/storage.service';

@Module({
  controllers: [MediasController],
  providers: [StorageService],
})
export class MediasModule {}
