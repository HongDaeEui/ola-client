import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experiment.findMany({
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { likes: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.experiment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}
