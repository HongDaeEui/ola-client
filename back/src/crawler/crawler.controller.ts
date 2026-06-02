import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';
import { AdminGuard } from '../common/admin.guard';

/**
 * 크롤러 관리 엔드포인트
 *
 * 인증: AdminGuard
 *   - X-Admin-Secret 헤더 == process.env.ADMIN_SECRET, 또는
 *   - Authorization: Bearer {Supabase JWT} (admin@olalab.kr)
 */
@ApiTags('crawler')
@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  /**
   * 모든 소스(ProductHunt + TAAFT)를 순차 크롤링하고 결과 통계를 반환한다.
   * 항목당 딜레이가 있어 수 분 소요될 수 있다.
   */
  @UseGuards(AdminGuard)
  @ApiSecurity('x-admin-secret')
  @ApiOperation({
    summary: '크롤러 수동 실행',
    description:
      '모든 소스를 순차 실행하고 통계를 반환합니다. X-Admin-Secret 헤더 필요.',
  })
  @Post('run')
  async run() {
    return this.crawlerService.runAll();
  }

  /**
   * 마지막 크롤링 실행 결과와 현재 실행 여부를 반환한다.
   */
  @UseGuards(AdminGuard)
  @ApiSecurity('x-admin-secret')
  @ApiOperation({
    summary: '크롤러 상태 조회',
    description: '마지막 실행 결과와 현재 실행 여부를 반환합니다.',
  })
  @Get('status')
  status() {
    return this.crawlerService.getLastRun();
  }
}
