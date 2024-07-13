import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsSubscriber } from './subscribers/product.subscriber';
import { QueringModule } from '../../quering/quering.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    QueringModule,
    CloudinaryModule,
    CommonModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsSubscriber],
})
export class ProductsModule {}
