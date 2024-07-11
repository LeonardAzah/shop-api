import {
  ClassSerializerInterceptor,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { VALIDATION_PIPE_OPTIONS } from './util/common.constants';
import { CustomLogger } from './custom-logger.service';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: Logger,
      useClass: CustomLogger,
    },
  ],
  exports: [Logger],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
