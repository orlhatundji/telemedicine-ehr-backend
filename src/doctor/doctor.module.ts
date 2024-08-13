import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DoctorController],
  providers: [
    DoctorService,
    UserService,
    PrismaService,
    JwtService,
    ConfigService,
  ],
})
export class DoctorModule {}
