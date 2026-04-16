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

  async rsvpToggle(meetupId: string, userEmail: string, userName: string) {
    const base = userName.replace(/\s+/g, '_').toLowerCase();
    const suffix = Math.random().toString(36).slice(2, 6);
    const user = await this.prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: { email: userEmail, username: `${base}_${suffix}`, name: userName },
    });

    const existing = await this.prisma.meetupAttendee.findUnique({
      where: { meetupId_userId: { meetupId, userId: user.id } },
    });

    if (existing) {
      await this.prisma.meetupAttendee.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.meetupAttendee.create({ data: { meetupId, userId: user.id } });
    }

    const attendeeCount = await this.prisma.meetupAttendee.count({ where: { meetupId } });
    return { attending: !existing, attendeeCount };
  }

  async getStatus(meetupId: string, userEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return { attending: false };
    const record = await this.prisma.meetupAttendee.findUnique({
      where: { meetupId_userId: { meetupId, userId: user.id } },
    });
    return { attending: !!record };
  }
}
