import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { TreatmentPlanService } from './treatmentplan.service';
import { CreateTreatmentPlanDto } from './dto/create-treatmentplan.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@UseGuards(AuthGuard)
@Controller('treatmentplan')
export class TreatmentPlanController {
  constructor(
    private readonly treatmentPlanService: TreatmentPlanService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  async create(
    @Req() req,
    @Body() createTreatmentPlanDto: CreateTreatmentPlanDto,
  ) {
    const { user } = req;
    if (user.role !== Role.DOCTOR) {
      return new HttpException('Only doctors can create treatment plans', 401);
    }

    const doctor = await this.prismaService.doctor.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
      },
    });

    createTreatmentPlanDto.startDate = new Date(
      createTreatmentPlanDto.startDate,
    );
    createTreatmentPlanDto.endDate = new Date(createTreatmentPlanDto.endDate);
    createTreatmentPlanDto['doctorId'] = doctor.id;
    return this.treatmentPlanService.create(createTreatmentPlanDto);
  }

  @Get()
  findAll() {
    return this.treatmentPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentPlanService.findOne(+id);
  }

  @Get('patient/:userId')
  async findAllByPatientId(@Param('userId', ParseIntPipe) userId: number) {
    const patient = await this.prismaService.patient.findUnique({
      where: { userId },
    });
    if (!patient) {
      return new HttpException('Patient not found', 404);
    }
    const patientId = patient.id;
    return await this.treatmentPlanService.findAllByPatientId(patientId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treatmentPlanService.remove(+id);
  }

  @Post('medication')
  async addMedication(@Body() data: CreateMedicationDto) {
    data.startDate = new Date(data.startDate);
    return await this.treatmentPlanService.addMedication(data);
  }

  @Patch('medication/:id')
  async updateMedication(
    @Param('id') id: string,
    @Body() data: UpdateMedicationDto,
  ) {
    const existingMedication = await this.prismaService.medication.findUnique({
      where: { id: +id },
    });
    if (!existingMedication) {
      return new HttpException('Medication not found', 404);
    }
    if (data.startDate) data.startDate = new Date(data.startDate);
    return await this.treatmentPlanService.updateMedication(+id, data);
  }
}
