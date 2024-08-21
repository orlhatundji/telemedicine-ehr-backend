import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpException,
  Req,
  Query,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PatientService } from './patient.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';
@Controller('patient')
export class PatientController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly patientService: PatientService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body()
    data: Prisma.PatientUncheckedCreateInput & Prisma.UserUncheckedCreateInput,
    @Req() req,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      return new HttpException('User already exists', 400);
    }

    try {
      const hospital = await this.prismaService.hospital.findUnique({
        where: { id: req.user.id },
      });

      if (!hospital) {
        return new HttpException('Hospital not found', 404);
      }
      const hash = await bcrypt.hash(
        '1234',
        this.configService.get('saltOrRounds'),
      );
      data.password = hash;
      if (data.dateOfBirth !== null && typeof data.dateOfBirth === 'string') {
        const dateOfBirth = new Date(data.dateOfBirth);
        if (isNaN(dateOfBirth.getTime())) {
          return new HttpException('Invalid date of birth', 400);
        }
        data.dateOfBirth = dateOfBirth;
      }
      const newData = {
        hospital: {
          connect: {
            id: req.user.id,
          },
        },
        user: {
          create: {
            ...data,
            role: Role.PATIENT,
          },
        },
      };
      return this.patientService.create(newData);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('assigned-doctors')
  async findAssignedDoctors(@Req() req) {
    const patient = await this.patientService.findOne({
      where: { email: req.user.email },
    });
    if (!patient) {
      return new HttpException('Patient not found', 404);
    }
    return this.patientService.getAssignedDoctors({ id: +patient.patient.id });
  }

  @UseGuards(AuthGuard)
  @Get('unique')
  async findOne(@Query() query) {
    const { email, id } = query;
    if (email) {
      return await this.patientService.findOne({
        where: { email },
      });
    } else if (id) {
      return await this.patientService.findOne({
        where: { id: +id },
      });
    }
    return new HttpException('Provide email or id', 400);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove({ id: Number(id) });
  }
}
