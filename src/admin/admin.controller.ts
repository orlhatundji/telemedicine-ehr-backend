import { Controller, Post, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('assign-doctor')
  async assignDoctor(@Req() data: { doctorId: number; patientId: number }) {
    return await this.prismaService.patient.update({
      where: { id: data.patientId },
      data: {
        assignedDoctors: {
          connect: { id: data.doctorId },
        },
      },
    });
  }
}
