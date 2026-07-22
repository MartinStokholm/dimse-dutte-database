import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example: Create a household
  const household = await prisma.household.create({
    data: {
      name: 'My Household',
      description: 'A household for testing',
    },
  });

  console.log('Created household:', household);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
