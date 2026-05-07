// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { newToolsMay2026 } from './new-tools-may2026';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`🌱 신규 도구 upsert 시작 — 총 ${newToolsMay2026.length}개`);

  let created = 0;
  let updated = 0;

  for (const tool of newToolsMay2026) {
    const existing = await prisma.tool.findFirst({ where: { name: tool.name } });
    if (existing) {
      await prisma.tool.update({ where: { id: existing.id }, data: tool });
      updated++;
      console.log(`  ↺ 업데이트: ${tool.name}`);
    } else {
      await prisma.tool.create({ data: { ...tool, status: 'ACTIVE' } });
      created++;
      console.log(`  ✅ 추가: ${tool.name}`);
    }
  }

  const total = await prisma.tool.count();
  console.log(`\n🎉 완료 — 신규: ${created}개, 업데이트: ${updated}개`);
  console.log(`📊 DB 총 tools: ${total}개`);
}

main()
  .catch((e) => { console.error('❌ 오류:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
