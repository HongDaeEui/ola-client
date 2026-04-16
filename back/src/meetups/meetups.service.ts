import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeetupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.meetup.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { attendees: true },
        },
      },
    });
  }

  async findUpcoming() {
    return this.prisma.meetup.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 3,
      include: {
        _count: {
          select: { attendees: true },
        },
      },
    });
  }
}
