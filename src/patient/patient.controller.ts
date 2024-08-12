import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: Prisma.PatientCreateInput) {
    return this.patientService.create(data);
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
