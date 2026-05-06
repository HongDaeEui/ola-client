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
import { PromptsService } from './prompts.service';
import { AdminGuard } from '../common/admin.guard';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  getPrompts(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
    @Query('page') page = '1',
    @Query('limit') limit?: string,
    @Query('admin') admin?: string,
  ) {
    const includeFlagged = admin === 'true';
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = take ? (parseInt(page, 10) - 1) * take : 0;
    return this.promptsService.findAll(
      { category, userEmail },
      skip,
      take,
      includeFlagged,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promptsService.findOne(id);
  }

  @Patch(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.promptsService.incrementViews(id);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promptsService.remove(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      title: string;
      toolName: string;
      category: string;
      content: string;
      userName: string;
    },
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.promptsService.create({
      title: body.title,
      toolName: body.toolName,
      category: body.category,
      content: body.content,
      userEmail: email,
      userName: body.userName,
    });
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
