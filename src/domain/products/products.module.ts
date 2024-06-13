import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { productsService } from './products.service';
import { FilesModule } from '../../files/files.module';
import { ProductsSubscriber } from './subscribers/product.subscriber';
import { QueringModule } from '../../quering/quering.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilesModule, QueringModule],
  controllers: [ProductsController],
  providers: [productsService, ProductsSubscriber],
})
export class ProductsModule {}
