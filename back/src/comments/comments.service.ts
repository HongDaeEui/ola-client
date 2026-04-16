import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { username: true, avatarUrl: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: {
    content: string;
    postId: string;
    userEmail: string;
    userName: string;
  }) {
    const base = data.userName.replace(/\s+/g, '_').toLowerCase();
    const suffix = Math.random().toString(36).slice(2, 6);
    const author = await this.prisma.user.upsert({
      where: { email: data.userEmail },
      update: {},
      create: {
        email: data.userEmail,
        username: `${base}_${suffix}`,
        name: data.userName,
      },
    });
    return this.prisma.comment.create({
      data: { content: data.content, postId: data.postId, authorId: author.id },
      include: {
        author: { select: { username: true, avatarUrl: true, email: true } },
      },
    });
  }

  async remove(id: string, userEmail: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });
    if (!comment || comment.author.email !== userEmail) return null;
    return this.prisma.comment.delete({ where: { id } });
  }
}
