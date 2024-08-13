import { Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('assign-doctor')
  async assignDoctor() {
    return await this.prismaService.patient.update({
      where: { id: 3 },
      data: {
        assignedDoctors: {
          connect: { id: 1 },
        },
      },
    });
  }
}
