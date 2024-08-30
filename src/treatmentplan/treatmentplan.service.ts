import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class TreatmentPlanService {
  constructor(private readonly prismaService: PrismaService) {}
  create(data: Prisma.TreatmentPlanUncheckedCreateInput) {
    try {
      return this.prismaService.treatmentPlan.create({ data });
    } catch (err) {
      return new HttpException(err.message, 400);
    }
  }

  findAll() {
    return this.prismaService.treatmentPlan.findMany({
      include: {
        medications: true,
      },
    });
  }

  findOne(id: number) {
    try {
      return this.prismaService.treatmentPlan.findUnique({ where: { id } });
    } catch (err) {
      return new HttpException(err.message, 400);
    }
  }

  findAllByPatientId(patientId: number) {
    try {
      return this.prismaService.treatmentPlan.findMany({
        where: { patientId },
        include: {
          medications: true,
        },
      });
    } catch (err) {
      return new HttpException(err.message, 400);
    }
  }

  update() {
    return `This action updates a treamentplan`;
  }

  remove(id: number) {
    try {
      return this.prismaService.treatmentPlan.delete({ where: { id } });
    } catch (err) {
      return new HttpException(err.message, 400);
    }
  }

  async addMedication(data: CreateMedicationDto) {
    try {
      return await this.prismaService.medication.create({ data });
    } catch (err) {
      return new HttpException(err.message, 400);
    }
  }

  async updateMedication(id: number, data: UpdateMedicationDto) {
    try {
      return await this.prismaService.medication.update({
        where: { id },
        data,
      });
    } catch (err) {
      return new HttpException(err.message, 400);
    }
  }
}
