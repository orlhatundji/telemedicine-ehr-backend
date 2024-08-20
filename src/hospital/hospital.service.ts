import { Injectable } from '@nestjs/common';
import { Hospital } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HospitalService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne({
    email,
  }: {
    email: string;
  }): Promise<Pick<Hospital, 'id' | 'email' | 'name'> | null> {
    const where = { email };
    return this.prismaService.hospital.findUnique({
      where,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
