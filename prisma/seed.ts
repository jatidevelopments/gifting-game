import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.assignment.deleteMany();
  await prisma.adjective.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'color' } }),
    prisma.category.create({ data: { name: 'texture' } }),
    prisma.category.create({ data: { name: 'style' } }),
    prisma.category.create({ data: { name: 'mood' } }),
    prisma.category.create({ data: { name: 'utility' } }),
    prisma.category.create({ data: { name: 'interest' } }),
  ]);

  // Create initial adjectives for each category
  const adjectives = [
    // Colors
    { word: 'red', categoryId: categories[0].id },
    { word: 'blue', categoryId: categories[0].id },
    { word: 'pastel', categoryId: categories[0].id },
    { word: 'vibrant', categoryId: categories[0].id },
    
    // Textures
    { word: 'soft', categoryId: categories[1].id },
    { word: 'smooth', categoryId: categories[1].id },
    { word: 'fluffy', categoryId: categories[1].id },
    { word: 'silky', categoryId: categories[1].id },
    
    // Styles
    { word: 'modern', categoryId: categories[2].id },
    { word: 'vintage', categoryId: categories[2].id },
    { word: 'elegant', categoryId: categories[2].id },
    { word: 'casual', categoryId: categories[2].id },
    
    // Moods
    { word: 'cozy', categoryId: categories[3].id },
    { word: 'cheerful', categoryId: categories[3].id },
    { word: 'relaxing', categoryId: categories[3].id },
    { word: 'energetic', categoryId: categories[3].id },
    
    // Utility
    { word: 'practical', categoryId: categories[4].id },
    { word: 'versatile', categoryId: categories[4].id },
    { word: 'portable', categoryId: categories[4].id },
    { word: 'durable', categoryId: categories[4].id },
    
    // Interests
    { word: 'creative', categoryId: categories[5].id },
    { word: 'sporty', categoryId: categories[5].id },
    { word: 'musical', categoryId: categories[5].id },
    { word: 'technical', categoryId: categories[5].id },
  ];

  await Promise.all(
    adjectives.map((adj) =>
      prisma.adjective.create({
        data: adj,
      })
    )
  );

  // Create some sample participants
  const participants = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' },
    { name: 'Diana' },
  ];

  await Promise.all(
    participants.map((participant) =>
      prisma.participant.create({
        data: participant,
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
