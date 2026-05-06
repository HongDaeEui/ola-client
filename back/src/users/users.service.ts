import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            prompts: true,
            experiments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: users,
    };
  }

  async updateRole(id: string, role: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });
    return {
      success: true,
      data: user,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUsername(email: string, username: string) {
    // 1. 유효성 검사: 한글, 영문, 숫자만 허용, 공백 불가
    const usernameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!usernameRegex.test(username)) {
      throw new Error('닉네임은 공백 및 특수문자 없이 한글, 영문, 숫자만 사용할 수 있습니다.');
    }

    // 2. 길이 제한
    if (username.length < 2 || username.length > 20) {
      throw new Error('닉네임은 2자 이상 20자 이하로 설정해야 합니다.');
    }

    // 3. 중복 검사
    const existing = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existing && existing.email !== email) {
      throw new Error('이미 사용 중인 닉네임입니다.');
    }

    // 4. 업데이트
    return this.prisma.user.update({
      where: { email },
      data: { username },
    });
  }
}
