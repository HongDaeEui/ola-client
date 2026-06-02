import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminGuard } from '../common/admin.guard';

@Controller('auth')
export class AuthController {
  @Post('sign-in')
  signIn(@Body() body: any) {
    const { loginId, password } = body;
    const expectedId = process.env.ADMIN_ID || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (loginId === expectedId && password === expectedPassword) {
      return {
        data: {
          accessToken: process.env.ADMIN_SECRET || 'ola_admin_secret_2026',
        },
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  @UseGuards(AdminGuard)
  @Get('self')
  getSelf(@Request() req: any) {
    return {
      data: {
        id: 1,
        loginId: process.env.ADMIN_ID || 'admin',
        name: 'Admin User',
        email: 'admin@olalab.kr',
        createdAt: new Date().toISOString(),
      },
    };
  }
}
