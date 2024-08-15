import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Prisma.ReviewCreateInput) {
    try {
      const review = await this.prismaService.review.create({
        data,
      });
      return review;
    } catch (err) {
      throw new HttpException(
        'Something went wrong, unable to create review',
        500,
        {},
      );
    }
  }

  findByUser(data: Prisma.ReviewFindFirstArgs) {
    return this.prismaService.review.findMany({
      where: data.where,
      include: data.include,
    });
  }
}
