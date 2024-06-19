import { Module } from '@nestjs/common';
import { CloudinaryService } from './CloudinaryService';
import { CloudinaryProvider } from './cloudinary';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
