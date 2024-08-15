import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() data: Prisma.ReviewCreateInput) {
    return this.reviewService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findByUser(@Req() req) {
    const user = await this.prismaService.user.findUnique({
      where: { email: req.user.email },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const data = {
      where: {},
      include: {
        doctor: { select: { name: true } },
        patient: { select: { name: true } },
      },
    };
    if (user.patient) {
      data.where = { patientId: user.patient.id };
    } else if (user.doctor) {
      data.where = { doctorId: user.doctor.id };
    }

    return this.reviewService.findByUser(data);
  }
}
