import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateMedicationDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  dosage: string;

  @IsOptional()
  @IsString()
  frequency: string;

  @IsOptional()
  @IsString()
  duration: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsString()
  @IsOptional()
  instructions: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;
}
