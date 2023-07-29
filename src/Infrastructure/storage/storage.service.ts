import { Bucket, Storage, StorageOptions } from '@google-cloud/storage';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { parse } from 'path';

import { File } from '../../shared/Interfaces/file.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private bucket: Bucket;
  private storage: Storage;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    const gcsConfig: StorageOptions = {
      projectId: configService.getOrThrow('GCS_PROJECT_ID'),
      keyFilename: 'src/.credentials/credentials.json', // Path ke file kredensial GCS
    };
    if (configService.getOrThrow('NODE_ENV') !== 'PRODUCTION') {
    }

    this.storage = new Storage(gcsConfig);
    this.bucket = this.storage.bucket(
      this.configService.getOrThrow('GCS_BUCKET_NAME'),
    );
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: File): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  async uploadFile(
    uploadedFile: File,
    destination: string,
  ): Promise<{
    path: string;
    publicUrl: string;
  }> {
    const fileName =
      this.setDestination(destination) + this.setFilename(uploadedFile);

    const file = this.bucket.file(fileName);
    try {
      const writeStream = file.createWriteStream({
        metadata: {
          contentType: uploadedFile.mimetype,
          acl: 'public-read',
        },
      });

      // Pipe stream dari buffer file ke writeStream untuk proses upload
      await new Promise((resolve, reject) => {
        writeStream
          .on('finish', resolve)
          .on('error', reject)
          .end(uploadedFile.buffer);
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
    return {
      path: file.name,
      publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
    };
  }

  async removeFile(fileName: string): Promise<any> {
    const file = this.bucket.file(fileName);
    try {
      const result = await file.delete();
      return result;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async moveFile(
    sourceFilePath: string,
    destinationFilePath: string,
  ): Promise<{
    publicUrl: string;
    path: string;
  }> {
    const sourceFile = this.bucket.file(sourceFilePath);
    const destinationFile = this.bucket.file(destinationFilePath);

    try {
      const readStream = sourceFile.createReadStream();

      const writeStream = destinationFile.createWriteStream();

      // Pipe stream dari sumber ke tujuan untuk melakukan pemindahan
      await new Promise<void>((resolve, reject) => {
        readStream
          .on('error', (err) => {
            reject(err);
          })
          .pipe(writeStream)
          .on('error', (err) => {
            reject(err);
          })
          .on('finish', () => {
            resolve();
          });
      });

      // Setelah pemindahan berhasil, hapus file sumber
      const deletePromise = sourceFile.delete();
      const makePublicPromise = destinationFile.makePublic();
      await Promise.all([deletePromise, makePublicPromise]);
      const publicUrl = destinationFile.publicUrl();
      return {
        publicUrl,
        path: destinationFilePath,
      };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
