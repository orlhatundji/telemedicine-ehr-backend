import { Module } from '@nestjs/common';
import { TreatmentPlanService } from './treatmentplan.service';
import { TreatmentPlanController } from './treatmentplan.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService, PrismaService, JwtService, ConfigService],
})
export class TreatmentPlanModule {}
