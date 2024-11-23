import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.category.deleteMany();

  // Create categories
  await Promise.all([
    prisma.category.create({ data: { name: 'color' } }),
    prisma.category.create({ data: { name: 'texture' } }),
    prisma.category.create({ data: { name: 'style' } }),
    prisma.category.create({ data: { name: 'mood' } }),
    prisma.category.create({ data: { name: 'utility' } }),
    prisma.category.create({ data: { name: 'interest' } }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
