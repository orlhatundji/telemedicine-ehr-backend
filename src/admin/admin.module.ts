import { Module } from '@nestjs/common';
import { PatientService } from 'src/patient/patient.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AdminController],
  providers: [PatientService, PrismaService, ConfigService],
})
export class AdminModule {}
