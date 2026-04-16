import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.resource.findMany({
      include: {
        author: {
          select: { username: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.resource.findMany({
      where: { isFeatured: true },
      include: {
        author: {
          select: { username: true, name: true },
        },
      },
      take: 2,
    });
  }
}
