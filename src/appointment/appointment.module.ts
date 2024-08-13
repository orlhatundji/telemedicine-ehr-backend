import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    PrismaService,
    JwtService,
    ConfigService,
    UserService,
    PatientService,
    DoctorService,
  ],
})
export class AppointmentModule {}
