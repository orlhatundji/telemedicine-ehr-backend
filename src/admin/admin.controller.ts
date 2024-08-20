import { Body, Controller, Delete, HttpException, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { AdminService } from './admin.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create-hospital')
  async createHospital(
    @Body() data: { name: string; email: string; password: string },
  ) {
    data.password = await bcrypt.hash(
      data.password,
      this.configService.get('saltOrRounds'),
    );
    try {
      await this.adminService.createHospital({
        ...data,
      });
      return { message: 'Hospital created successfully' };
    } catch (error) {
      throw new HttpException('Error creating hospital', 500);
    }
  }

  @Post('hospitals')
  async getHospitals(@Body() data: Prisma.HospitalFindManyArgs) {
    return await this.adminService.getHospitals(data);
  }

  @Delete('delete-hospital')
  async deleteHospital(@Body() data: { id: number }) {
    const hospital = await this.adminService.getHospital({
      id: data.id,
    });
    if (!hospital) {
      throw new HttpException('Hospital not found', 404);
    }
    try {
      await this.adminService.deleteHospital({
        id: data.id,
      });
      return { message: 'Hospital deleted successfully' };
    } catch (error) {
      throw new HttpException('Error deleting hospital', 500);
    }
  }

  @Post('assign-doctor')
  async assignDoctor(@Body() data: { doctorId: number; patientId: number }) {
    const patient = await this.prismaService.patient.findUnique({
      where: { id: data.patientId },
    });
    if (!patient) {
      throw new HttpException('Patient not found', 404);
    }
    try {
      await this.prismaService.patient.update({
        where: { id: data.patientId },
        data: {
          assignedDoctors: {
            connect: { id: data.doctorId },
          },
        },
      });
      return { message: 'Doctor assigned successfully' };
    } catch (error) {
      throw new HttpException('Error assigning doctor', 500);
    }
  }
}
