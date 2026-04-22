"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const prisma_exception_filter_1 = require("./common/prisma-exception.filter");
const express_1 = __importDefault(require("express"));
let cachedServer;
async function bootstrapServer() {
    if (!cachedServer) {
        const expressApp = (0, express_1.default)();
        const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        nestApp.enableCors({
            origin: [
                'http://localhost:3000',
                'https://olalab.kr',
                /\.olalab\.kr$/,
                /ola-.*\.vercel\.app$/,
            ],
            credentials: true,
        });
        nestApp.setGlobalPrefix('api');
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Ola AI Platform API')
            .setDescription('The core API documentation for the Ola AI platform community ecosystem.')
            .setVersion('1.0')
            .addTag('tools')
            .addTag('meetups')
            .addTag('resources')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(nestApp, config);
        swagger_1.SwaggerModule.setup('api/docs', nestApp, document);
        nestApp.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
        await nestApp.init();
        cachedServer = expressApp;
        if (!process.env.VERCEL) {
            const port = process.env.PORT || 3002;
            await nestApp.listen(port);
            console.log(`🚀 [Local] Data Core is running on: http://localhost:${port}`);
        }
    }
    return cachedServer;
}
async function default_1(req, res) {
    const server = await bootstrapServer();
    return server(req, res);
}
if (!process.env.VERCEL) {
    bootstrapServer();
}
//# sourceMappingURL=main.js.map