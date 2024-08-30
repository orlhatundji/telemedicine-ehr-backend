import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMedicationDto {
  @IsNumber()
  treatmentId: number;

  @IsString()
  name: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsString()
  duration: string;

  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  @IsOptional()
  instructions: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
