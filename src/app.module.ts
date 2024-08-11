import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FRONTEND_URL1: Joi.string().required(),
        FRONTEND_URL2: Joi.string().required(),
        FRONTEND_URL3: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    UserModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
