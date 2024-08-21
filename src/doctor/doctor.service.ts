import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Doctor, Prisma, Role, User } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private prismaService: PrismaService) {}

  async doctor(
    doctorWhereUniqueInput: Prisma.DoctorWhereUniqueInput,
  ): Promise<Doctor | null> {
    return this.prismaService.doctor.findUnique({
      where: doctorWhereUniqueInput,
    });
  }

  async doctors(): Promise<Doctor[]> {
    return this.prismaService.doctor.findMany({
      include: {
        _count: {
          select: {
            assignedPatients: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            gender: true,
            dateOfBirth: true,
            name: true,
            phone: true,
            maritalStatus: true,
            nextOfKin: true,
            nextOfKinRelationShip: true,
            emergencyContact: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.DoctorCreateInput) {
    return this.prismaService.doctor.create({
      data,
      select: {
        id: true,
        userId: true,
      },
    });
  }

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<(User & { doctor: { id: number; userId: number } }) | null> {
    const { where } = params;
    return this.prismaService.user.findUnique({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });
  }

  async findUnique(params: { where: Prisma.UserWhereUniqueInput }): Promise<
    | (Omit<User, 'password'> & {
        doctor: {
          id: number;
          userId: number;
          assignedDoctors?: { id: number }[];
        };
      })
    | null
  > {
    const { where } = params;
    where.role = Role.DOCTOR;
    try {
      const doctor = await this.prismaService.user.findUnique({
        where,
        include: {
          doctor: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });
      if (!doctor) {
        throw new HttpException('doctor not found', 404);
      }
      delete doctor.password;
      return doctor;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
