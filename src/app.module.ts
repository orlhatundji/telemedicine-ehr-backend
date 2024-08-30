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
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './prisma.service';
import { ReviewModule } from './review/review.module';
import { ZoomModule } from './zoom/zoom.module';
import { ZoomController } from './zoom/zoom.controller';
import { ZoomService } from './zoom/zoom.service';
import { MessagingModule } from './messaging/messaging.module';
import { HospitalModule } from './hospital/hospital.module';
import { MailSchedulerService } from './mail-scheduler/mail-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppointmentService } from './appointment/appointment.service';
import { TreatmentPlanModule } from './treatmentplan/treatmentplan.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FRONTEND_URL1: Joi.string().required(),
        FRONTEND_URL2: Joi.string().required(),
        FRONTEND_URL3: Joi.string().required(),
        FRONTEND_URL4: Joi.string().required(),
        FRONTEND_URL5: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        saltOrRounds: Joi.number().required(),
        PORT: Joi.number(),
      }),
    }),
    ScheduleModule.forRoot(),
    AdminModule,
    AuthModule,
    UserModule,
    DoctorModule,
    PatientModule,
    AppointmentModule,
    AdminModule,
    ReviewModule,
    ZoomModule,
    MessagingModule,
    HospitalModule,
    TreatmentPlanModule,
  ],
  controllers: [AppController, ZoomController],
  providers: [
    AppService,
    PrismaService,
    ZoomService,
    MailSchedulerService,
    AppointmentService,
    MailSchedulerService,
  ],
})
export class AppModule {}
