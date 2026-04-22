import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://olalab.kr',
      /\.olalab\.kr$/,
      /ola-.*\.vercel\.app$/,
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

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

  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 Server is running on: http://localhost:${port}`);
}

bootstrap();
