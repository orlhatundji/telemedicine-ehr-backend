import { TreatmentStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTreatmentPlanDto {
  @IsString()
  title: string;

  @IsNumber()
  patientId: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsEnum(TreatmentStatus)
  @IsOptional()
  status: TreatmentStatus;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
