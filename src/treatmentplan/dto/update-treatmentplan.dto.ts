import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentPlanDto } from './create-treatmentplan.dto';

export class UpdateTreatmentPlanDto extends PartialType(
  CreateTreatmentPlanDto,
) {}
