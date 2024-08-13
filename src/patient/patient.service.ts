import { HttpException, Injectable } from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PatientService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prismaService.patient.create({
      data,
      include: { user: { select: { email: true } } },
    });
  }

  findAll() {
    return this.prismaService.patient.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(params: { where: Prisma.UserWhereUniqueInput }): Promise<
    | ({
        id: number;
        email: string;
        role: string;
      } & {
        patient: {
          id: number;
          name: string;
          userId: number;
          assignedDoctors?: { id: number; name: string }[];
        };
      })
    | null
  > {
    const { where } = params;
    return this.prismaService.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        password: false,
        patient: {
          select: {
            id: true,
            name: true,
            userId: true,
            assignedDoctors: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async update(params: {
    where: Prisma.PatientWhereUniqueInput;
    data: Prisma.PatientUpdateInput;
  }): Promise<Patient> {
    const { where, data } = params;
    return this.prismaService.patient.update({ where, data });
  }

  async remove(where: Prisma.PatientWhereUniqueInput): Promise<void> {
    const patient = await this.prismaService.patient.findUnique({ where });
    if (!patient) {
      throw new HttpException('Patient not found', 404, {});
    } else {
      await this.prismaService.user.delete({
        where: {
          id: +patient.userId,
        },
      });
    }
  }
}
