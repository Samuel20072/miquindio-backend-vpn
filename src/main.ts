import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
  });

  app.useStaticAssets(resolve(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
}

bootstrap();
