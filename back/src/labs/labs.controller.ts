import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LabsService } from './labs.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get()
  async getExperiments(@Query('category') category?: string) {
    return this.labsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labsService.findOne(id);
  }

  /**
   * 관리자용 실험실 직접 추가 엔드포인트
   * - X-Admin-Secret 헤더 필요 (AdminGuard)
   * - authorId 미지정 시 ADMIN 권한 사용자를 자동 조회하여 author로 지정
   */
  @UseGuards(AdminGuard)
  @Post('admin')
  adminCreate(
    @Body()
    body: {
      title: string;
      description: string;
      content?: string;
      category: string;
      difficulty?: string;
      emoji?: string;
      metric: string;
      stack?: string[];
      color?: string;
      authorId?: string;
    },
  ) {
    return this.labsService.adminCreate(body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labsService.remove(id);
  }
}
