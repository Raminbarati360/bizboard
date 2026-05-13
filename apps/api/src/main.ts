import 'reflect-metadata';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module.js';
import { corsOrigins, loadEnv } from '@bizboard/config';

async function bootstrap() {
  const env = loadEnv(process.env);
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.enableCors({
    origin: corsOrigins(process.env.API_CORS_ORIGINS),
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Bizboard API')
    .setDescription('Bizboard MVP API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT);
  console.log(`Bizboard API listening on :${env.PORT}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
