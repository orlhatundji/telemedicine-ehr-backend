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
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        patient: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
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

  findByDoctorByDate(data: { date: Date; doctorId: number }) {
    return this.prismaService.appointment.findMany({
      where: {
        date: data.date,
        doctorId: data.doctorId,
      },
    });
  }

  findAllToday() {
    return this.prismaService.appointment.findMany({
      where: {
        date: {
          gte: new Date(),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      select: {
        date: true,
        doctor: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        patient: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
}
