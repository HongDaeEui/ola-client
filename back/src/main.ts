import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 서버 인스턴스를 하나만 생성하여 캐싱 (콜드 스타트 최소화)
let cachedServer: express.Express | undefined;

async function bootstrapServer(): Promise<express.Express> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // Enable CORS for frontend integration
    nestApp.enableCors({
      origin: [
        'http://localhost:3000',
        'https://olalab.kr',
        /\.olalab\.kr$/,
        /ola-.*\.vercel\.app$/, // Allow Vercel preview URLs
      ],
      credentials: true,
    });

    // Set global prefix for API
    nestApp.setGlobalPrefix('api');

    // Swagger Documentation Setup
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
    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api/docs', nestApp, document);

    await nestApp.init();
    cachedServer = expressApp;

    // 만약 로컬 서버라면 `listen`을 호출해야 함.
    // Vercel이 아니라면 NestJS 고유의 listen을 엽니다.
    if (!process.env.VERCEL) {
      const port = process.env.PORT || 3002;
      await nestApp.listen(port);
      console.log(
        `🚀 [Local] Data Core is running on: http://localhost:${port}`,
      );
    }
  }
  return cachedServer!;
}

// 1. 만약 Vercel 서버리스 모드라면 (요청이 들어올 때마다 Vercel이 이 함수를 호출합니다!)
export default async function (req: any, res: any) {
  const server = await bootstrapServer();
  return server(req, res);
}

// 2. 만약 로컬 개발 모드라면 (터미널에서 직접 실행한 경우)
if (!process.env.VERCEL) {
  bootstrapServer();
}
