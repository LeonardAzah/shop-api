import { Injectable, Logger } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        this.logger.error('Failed to fetch data', error.stack);
        resolve(result);
      });
      this.logger.log(`uploading file: ${upload}`);
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<CloudinaryResponse[]> {
    return Promise.all(files.map((file) => this.uploadFile(file, folder)));
  }
}
