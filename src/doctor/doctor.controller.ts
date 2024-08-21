import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  HttpException,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DoctorService } from './doctor.service';
import { Prisma, Role } from '@prisma/client';
import { UserService } from 'src/users/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll() {
    return this.doctorService.doctors();
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body()
    data: Prisma.DoctorUncheckedCreateInput & Prisma.UserUncheckedCreateInput,
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
      const { specialty, ...rest } = data;
      const newData = {
        specialty,
        hospital: {
          connect: {
            id: req.user.id,
          },
        },
        user: {
          create: {
            ...rest,
            role: Role.DOCTOR,
          },
        },
      };
      return this.doctorService.create(newData);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get('unique')
  async findOne(@Query() query) {
    const { email, id } = query;
    if (email) {
      return await this.doctorService.findUnique({
        where: { email },
      });
    } else if (id) {
      return await this.doctorService.findUnique({
        where: { id: +id },
      });
    }
    return new HttpException('Provide email or id', 400);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove({ id: Number(id) });
  }
}
