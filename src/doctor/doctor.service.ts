import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Doctor, Prisma } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async doctor(
    doctorWhereUniqueInput: Prisma.DoctorWhereUniqueInput,
  ): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({
      where: doctorWhereUniqueInput,
    });
  }

  async doctors(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DoctorWhereUniqueInput;
    where?: Prisma.DoctorWhereInput;
    orderBy?: Prisma.DoctorOrderByWithRelationInput;
  }): Promise<Doctor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.doctor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.DoctorUncheckedCreateInput): Promise<Doctor> {
    return this.prisma.doctor.create({
      data,
    });
  }
}
