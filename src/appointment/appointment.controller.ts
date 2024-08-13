import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { Role } from '@prisma/client';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly prismaService: PrismaService,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req, @Body() data: { date: Date }) {
    const user = await this.prismaService.user.findUnique({
      where: { email: req.user.email },
      include: {
        patient: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error('Patient not found');
    }
    return this.appointmentService.create({
      date: new Date(data.date),
      patientId: user.patient.id,
      doctorId: 1,
    });
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll() {
    return this.appointmentService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserAppointments(@Req() req) {
    const user = req.user;
    let where;
    let include;
    if (user.role === Role.DOCTOR) {
      const doctor = await this.doctorService.findOne({
        where: { email: req.user.email },
      });
      where = {
        doctorId: doctor.doctor.id,
      };
      include = {
        patient: {
          select: {
            name: true,
          },
        },
      };
    } else {
      const patient = await this.patientService.findOne({
        where: { email: req.user.email },
      });

      where = {
        patientId: patient.patient.id,
      };
      include = {
        doctor: {
          select: {
            name: true,
          },
        },
      };
    }
    return this.appointmentService.findByUser({
      where,
      include,
    });
  }
}
