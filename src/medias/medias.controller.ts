import {
  Controller,
  Post,
  UploadedFiles,
  Logger,
  Body,
  Delete,
  HttpCode,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from '../Infrastructure/storage/storage.service';
import { randomUUID } from 'crypto';
import { ApiConsumes } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('medias')
export class MediasController {
  private readonly logger = new Logger(MediasController.name);
  constructor(private readonly cloudStorageService: StorageService) {}

  @Delete('/uploads')
  @HttpCode(200)
  async deleteFile(@Body('filePath') filePath: string) {
    const result = await this.cloudStorageService.removeFile(filePath);
    this.logger.debug('result deleting file', result);
    return;
  }

  @Post('/uploads')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (files.length == 0) {
      throw new BadRequestException('No file was uploaded.');
    }
    if (files.length > 1) {
      throw new BadRequestException('Only one file are allowed');
    }
    const uniqueFolder = randomUUID();
    const destination = 'temp/' + uniqueFolder;
    const uploadedFile = await this.cloudStorageService.uploadFile(
      files[0],
      destination,
    );

    if (!uploadedFile) {
      return false;
    }

    return uploadedFile.path;
  }
}
