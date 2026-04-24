import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Graceful shutdown hooks (SIGTERM, SIGINT)
  app.enableShutdownHooks();

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://olalab.kr',
      /\.olalab\.kr$/,
      /ola-.*\.vercel\.app$/,
      /\.onrender\.com$/,
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // 입력값 검증 파이프라인
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // 예외 필터: 순서 중요 — 일반 필터 먼저, Prisma 필터를 나중에 등록하면
  // Prisma 에러가 먼저 매칭됩니다 (NestJS는 역순으로 필터를 적용)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Ola AI Platform API')
    .setDescription(
      'The core API documentation for the Ola AI platform community ecosystem.',
    )
    .setVersion('1.0')
    .addTag('tools')
    .addTag('meetups')
    .addTag('resources')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  logger.log(`🚀 Server is running on: http://localhost:${port}`);
}

bootstrap();

