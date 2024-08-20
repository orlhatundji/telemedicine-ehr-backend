import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { PrismaService } from 'src/prisma.service';

@Controller('hospital')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly prismaService: PrismaService,
  ) {}
  @Post('assign-doctor')
  async assignDoctor(@Body() data: { doctorId: number; patientId: number }) {
    const patient = await this.prismaService.patient.findUnique({
      where: { id: data.patientId },
    });
    if (!patient) {
      throw new HttpException('Patient not found', 404);
    }
    try {
      await this.prismaService.patient.update({
        where: { id: data.patientId },
        data: {
          assignedDoctors: {
            connect: { id: data.doctorId },
          },
        },
      });
      return { message: 'Doctor assigned successfully' };
    } catch (error) {
      throw new HttpException('Error assigning doctor', 500);
    }
  }
}
