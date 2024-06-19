import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { UsersSubscriber } from './subscribers/users.subscribers';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { QueringModule } from '../../quering/quering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    CloudinaryModule,
    QueringModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber],
})
export class UsersModule {}
