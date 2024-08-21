import {
  Body,
  Controller,
  HttpException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    if (data.dateOfBirth !== null && typeof data.dateOfBirth === 'string') {
      data.dateOfBirth = new Date(data.dateOfBirth);
      if (isNaN(data.dateOfBirth.getTime())) {
        return new HttpException('Invalid date of birth', 400);
      }
    }
    return this.userService.update({
      where: { id: Number(id) },
      data,
    });
  }
}
