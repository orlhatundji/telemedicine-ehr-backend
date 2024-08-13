import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Doctor, Prisma, User } from '@prisma/client';

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

  async doctors(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DoctorWhereUniqueInput;
    where?: Prisma.DoctorWhereInput;
    orderBy?: Prisma.DoctorOrderByWithRelationInput;
  }): Promise<Doctor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.doctor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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

  async create(data: Prisma.DoctorUncheckedCreateInput) {
    return this.prismaService.doctor.create({
      data,
    });
  }

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<
    (User & { doctor: { id: number; name: string; userId: number } }) | null
  > {
    const { where } = params;
    return this.prismaService.user.findUnique({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });
  }
}
