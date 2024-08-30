import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WebsocketAdapter } from './chat/websocket-adapter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL1'),
      configService.get('FRONTEND_URL2'),
      configService.get('FRONTEND_URL3'),
      configService.get('FRONTEND_URL4'),
      configService.get('FRONTEND_URL5'),
    ],
  });

  app.useWebSocketAdapter(
    new WebsocketAdapter(app, {
      origin: [
        configService.get('FRONTEND_URL1'),
        configService.get('FRONTEND_URL2'),
        configService.get('FRONTEND_URL3'),
        configService.get('FRONTEND_URL4'),
        configService.get('FRONTEND_URL5'),
      ],
    }),
  );
  await app.listen(configService.get('PORT'));
}
bootstrap();
