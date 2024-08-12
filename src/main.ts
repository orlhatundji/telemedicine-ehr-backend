import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WebsocketAdapter } from './chat/websocket-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL1'),
      configService.get('FRONTEND_URL2'),
      configService.get('FRONTEND_URL3'),
    ],
  });

  app.useWebSocketAdapter(
    new WebsocketAdapter(app, {
      origin: [
        configService.get('FRONTEND_URL1'),
        configService.get('FRONTEND_URL2'),
        configService.get('FRONTEND_URL3'),
      ],
    }),
  );
  await app.listen(3003);
}
bootstrap();
