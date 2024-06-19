import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { productsService } from './products.service';
import { ProductsSubscriber } from './subscribers/product.subscriber';
import { QueringModule } from '../../quering/quering.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    QueringModule,
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [productsService, ProductsSubscriber],
})
export class ProductsModule {}
