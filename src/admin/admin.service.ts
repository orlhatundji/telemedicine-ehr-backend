import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Hospital, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async createHospital(data: Prisma.HospitalCreateInput): Promise<Hospital> {
    return await this.prismaService.hospital.create({
      data,
    });
  }

  async getHospitals(data: Prisma.HospitalFindManyArgs): Promise<Hospital[]> {
    data.select = {
      id: true,
      name: true,
      email: true,
    };
    return this.prismaService.hospital.findMany(data);
  }

  async getHospital(data: { id: number }): Promise<Hospital> {
    return this.prismaService.hospital.findUnique({
      where: { id: data.id },
    });
  }

  async deleteHospital(data: { id: number }): Promise<Hospital> {
    return this.prismaService.hospital.delete({
      where: { id: data.id },
    });
  }
}
