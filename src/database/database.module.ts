import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingModule } from './seeding/seeding.module';
import databaseConfig from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './exception-filters/not-found-exception/not-found-exception.filter';
import { DatabaseExceptionFilter } from './exception-filters/database-exception/database-exception.filter';
import { AllExceptionsFilter } from './exception-filters/http-exception-filters/http-exception-filter.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    SeedingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class DatabaseModule {}
