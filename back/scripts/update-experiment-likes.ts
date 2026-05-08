import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Updating Experiment likes...');
  const experiments = await prisma.experiment.findMany();
  let count = 0;
  for (const exp of experiments) {
    // Generate a random number between 10 and 99
    const newLikes = Math.floor(Math.random() * 90) + 10;
    await prisma.experiment.update({
      where: { id: exp.id },
      data: { likes: newLikes },
    });
    count++;
  }
  console.log(`Successfully updated likes for ${count} experiments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
