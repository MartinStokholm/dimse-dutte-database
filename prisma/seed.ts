import { prisma } from '../src/services/database';

async function main() {
  await prisma.household.create({
    data: {
      name: 'Søren Frichs Vej 57C',
      description: 'Her bor Emilie og Martin',
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
