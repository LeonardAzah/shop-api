import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { User } from '../domain/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strateges/local.strategy';
import { LoginValidationMiddleware } from './middleware/login-validation/login-validation.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strateges/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { THROTTLER_MODULE_OPTIONS } from './util/auth.constants';
import { CommonModule } from '../common/common.module';
import { GoogleStrategy } from './strateges/google.strategy';
import { RefreshJwtStrategy } from './strateges/refresh-token.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    ThrottlerModule.forRoot(THROTTLER_MODULE_OPTIONS),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingService, useClass: BcryptService },
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],

  exports: [HashingService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('auth/login');
  }
}
