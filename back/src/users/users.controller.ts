import { Controller, Get, Patch, Param, Body, Headers, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from '../common/admin.guard';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AdminGuard)
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role as any);
  }

  @Get('me')
  async getMe(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found in DB');
    return user;
  }

  @Patch('me/username')
  async updateUsername(
    @Headers('authorization') authorization?: string,
    @Body('username') username?: string,
  ) {
    if (!username || typeof username !== 'string') {
      throw new BadRequestException('username is required');
    }
    const { email } = await this.extractUser(authorization);
    try {
      const updatedUser = await this.usersService.updateUsername(email, username);
      return { success: true, data: updatedUser };
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  private async extractUser(authorization?: string) {
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token.');
    }
    const token = authorization.slice(7).trim();
    if (!token) throw new UnauthorizedException('Empty Bearer token.');
    return verifySupabaseJwt(token);
  }
}
