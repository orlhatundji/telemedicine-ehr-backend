import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/users/user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async findAll() {
    return this.doctorService.doctors({});
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  async findDoctor(@Param('email') email: string) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      return 'Doctor not found with this email';
    }
    return this.doctorService.doctor({ userId: user.id });
  }

  @Post()
  async create(
    @Body()
    doctorCreateInput: Prisma.DoctorCreateInput & {
      email: string;
      password: string;
      name: string;
    },
  ) {
    const { email, password, name, ...rest } = doctorCreateInput;
    const user = await this.userService.findOne({ email: email });
    if (user) {
      return 'Doctor already exists with this email';
    }
    let createdUser;
    try {
      createdUser = await this.userService.createUser({
        email,
        password,
        name,
        role: 'DOCTOR',
        doctor: {
          create: rest,
        },
      });
    } catch (error) {
      return 'Doctor not created';
    }
    delete createdUser.password;
    return createdUser;
  }
}
