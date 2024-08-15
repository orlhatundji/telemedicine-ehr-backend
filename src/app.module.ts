import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './prisma.service';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FRONTEND_URL1: Joi.string().required(),
        FRONTEND_URL2: Joi.string().required(),
        FRONTEND_URL3: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        saltOrRounds: Joi.number().required(),
        PORT: Joi.number(),
      }),
    }),
    AuthModule,
    UserModule,
    DoctorModule,
    PatientModule,
    AppointmentModule,
    AdminModule,
    ReviewModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
