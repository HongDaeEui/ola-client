"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Updating Experiment likes...');
    const experiments = await prisma.experiment.findMany();
    let count = 0;
    for (const exp of experiments) {
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
//# sourceMappingURL=update-experiment-likes.js.map