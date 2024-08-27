import { HttpException, Injectable } from '@nestjs/common';
import { Patient, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PatientService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    try {
      const patient = await this.prismaService.patient.create({
        data,
        include: { user: true },
      });
      delete patient.user.password;
      return patient;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  findAll() {
    return this.prismaService.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            gender: true,
            dateOfBirth: true,
            name: true,
            phone: true,
            occupation: true,
            maritalStatus: true,
            nextOfKin: true,
            nextOfKinRelationShip: true,
            emergencyContact: true,
          },
        },
      },
    });
  }

  async findOne(params: { where: Prisma.UserWhereUniqueInput }): Promise<
    | (Omit<User, 'password'> & {
        patient: {
          id: number;
          userId: number;
          assignedDoctors?: { id: number }[];
        };
      })
    | null
  > {
    const { where } = params;
    where.role = Role.PATIENT;
    try {
      const patient = await this.prismaService.user.findUnique({
        where,
        include: {
          patient: {
            include: {
              assignedDoctors: {
                select: { id: true },
              },
            },
          },
        },
      });
      if (!patient) {
        throw new HttpException('Patient not found', 404);
      }
      delete patient.password;
      return patient;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getAssignedDoctors(
    where: Prisma.PatientWhereUniqueInput,
  ): Promise<{ specialty: string; user: { name: string; id: number } }[]> {
    const assignedDoctors = await this.prismaService.patient.findUnique({
      where,
      select: {
        assignedDoctors: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return assignedDoctors.assignedDoctors;
  }

  async update(params: {
    where: Prisma.PatientWhereUniqueInput;
    data: Prisma.PatientUpdateInput;
  }): Promise<Patient> {
    const { where, data } = params;
    try {
      return await this.prismaService.patient.update({ where, data });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<void> {
    const patient = await this.prismaService.user.findUnique({ where });
    if (!patient) {
      throw new HttpException('Patient not found', 404, {});
    } else {
      await this.prismaService.user.delete({
        where: {
          id: +patient.id,
        },
      });
    }
  }
}
