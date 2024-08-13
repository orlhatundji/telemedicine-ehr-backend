import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpException,
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
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      return new HttpException('User already exists', 400);
    }
    const hash = await bcrypt.hash(
      data.password,
      this.configService.get('saltOrRounds'),
    );
    data.password = hash;
    const newData = {
      name: data.name,
      user: {
        create: {
          email: data.email,
          role: Role.PATIENT,
          password: data.password,
        },
      },
    };
    return this.patientService.create(newData);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.patientService.findOne({ where: { email } });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove({ id: Number(id) });
  }
}
