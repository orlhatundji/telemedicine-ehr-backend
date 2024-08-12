import { HttpException, Injectable } from '@nestjs/common';
import { Patient, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientService {
  constructor(private prismaService: PrismaService) {}
  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    data.user.create.role = 'PATIENT';
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.user.create.password, saltOrRounds);
    data.user.create.password = hash;
    return this.prismaService.patient.create({ data });
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

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User | null> {
    const { where } = params;
    return this.prismaService.user.findUnique({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            userId: true,
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
