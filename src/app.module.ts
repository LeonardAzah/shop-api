import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { OrdersModule } from './domain/orders/orders.module';
import { PaymentsModule } from './domain/payments/payments.module';
import { CategoriesModule } from './domain/categories/categories.module';
import { ProductsModule } from './domain/products/products.module';
import { AuthModule } from './auth/auth.module';
import { QueringModule } from './quering/quering.module';
import { FilteringService } from './quering/filtering.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/CloudinaryService';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { RatingsModule } from './domain/ratings/ratings.module';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    DatabaseModule,
    EnvModule,
    OrdersModule,
    PaymentsModule,
    CategoriesModule,
    ProductsModule,
    AuthModule,
    QueringModule,
    CloudinaryModule,
    RatingsModule,
  ],
  providers: [FilteringService, CloudinaryService, NotificationsGateway],
})
export class AppModule {}
