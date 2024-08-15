import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  app.set('trust proxy', 1);

  app.enableCors();
  app.use(helmet());
  // app.use(express.json());
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
  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`Application has started on port ${process.env.PORT}`);
}
bootstrap();
