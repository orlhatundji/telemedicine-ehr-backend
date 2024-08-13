import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.AppointmentUncheckedCreateInput) {
    try {
      return this.prismaService.appointment.create({
        data,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', 500, {});
    }
  }

  findAll() {
    return this.prismaService.appointment.findMany({
      select: {
        doctorId: true,
        patientId: true,
        doctor: {
          select: {
            name: true,
          },
        },
        patient: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findByUser(data: Prisma.AppointmentFindFirstArgs) {
    return this.prismaService.appointment.findMany({
      where: data.where,
      include: data.include,
    });
  }
}
