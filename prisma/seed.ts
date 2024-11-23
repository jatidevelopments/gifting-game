import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('🧹 Cleaning up existing data...');
  
  // Clear existing data in the correct order to respect foreign key constraints
  await prisma.assignment.deleteMany();
  console.info('✅ Cleared assignments');
  
  await prisma.participant.deleteMany();
  console.info('✅ Cleared participants');
  
  await prisma.adjective.deleteMany();
  console.info('✅ Cleared adjectives');
  
  await prisma.category.deleteMany();
  console.info('✅ Cleared categories');
  
  await prisma.gameRoom.deleteMany();
  console.info('✅ Cleared game rooms');

  console.info('🌱 Creating new categories...');
  // Create categories
  await Promise.all([
    prisma.category.create({ data: { name: 'color' } }),
    prisma.category.create({ data: { name: 'texture' } }),
    prisma.category.create({ data: { name: 'style' } }),
    prisma.category.create({ data: { name: 'mood' } }),
    prisma.category.create({ data: { name: 'utility' } }),
    prisma.category.create({ data: { name: 'interest' } }),
  ]);
  console.info('✅ Created categories');
}

main()
  .then(() => {
    console.info('🎉 Seed completed successfully');
  })
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
