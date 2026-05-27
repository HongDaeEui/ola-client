import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostsService } from './posts.service';
import { AdminGuard } from '../common/admin.guard';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
    @Query('page') page = '1',
    @Query('limit') limit?: string,
    @Query('admin') admin?: string,
  ) {
    const includeFlagged = admin === 'true';
    if (userEmail)
      return this.postsService.findByUserEmail(userEmail, includeFlagged);
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = take ? (parseInt(page, 10) - 1) * take : 0;
    return this.postsService.findAll(category, skip, take, includeFlagged);
  }

  @Get('ranking')
  findTopByViews() {
    return this.postsService.findTopByViews();
  }

  @Get('tag-stats')
  getTagStats() {
    return this.postsService.getTagStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Delete(':id/user')
  async removeByUser(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.postsService.removeByUser(id, email);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string; category?: string; imageUrl?: string | null },
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.postsService.update(id, email, body);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  async create(
    @Body()
    body: {
      title: string;
      content: string;
      category: string;
      imageUrl?: string;
      userName: string;
    },
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.postsService.create({
      title: body.title,
      content: body.content,
      category: body.category,
      imageUrl: body.imageUrl,
      userEmail: email,
      userName: body.userName,
    });
  }

  @Patch(':id/view')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  incrementViews(@Param('id') id: string) {
    return this.postsService.incrementViews(id);
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
