import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors();
  app.use(helmet());

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('The Pipe Shop')
    .setDescription('Documentation for the shop API')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  logger.log('Application has started on port 3000');
}
bootstrap();
