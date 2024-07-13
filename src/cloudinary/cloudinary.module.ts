import { Module } from '@nestjs/common';
import { CloudinaryService } from './CloudinaryService';
import { CloudinaryProvider } from './cloudinary';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
