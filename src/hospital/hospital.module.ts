import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [HospitalController],
  providers: [HospitalService, ConfigService, PrismaService],
})
export class HospitalModule {}
