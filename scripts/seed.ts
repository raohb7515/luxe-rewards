import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding database...');

  // Users
  await prisma.user.createMany({
    data: [
      { name: 'Yousaf Tester', email: 'you@gmail.com', password: 'hashed_password_here' },
      { name: 'Admin User', email: 'admin@gmail.com', password: 'hashed_password_here', isAdmin: true },
    ],
    // skipDuplicates: true,
  });

  // Products
  await prisma.product.createMany({
    data: [
      { name: 'Product 1', description: 'Description 1', price: 100, image: 'product1.png', stock: 10 },
      { name: 'Product 2', description: 'Description 2', price: 200, image: 'product2.png', stock: 5 },
    ],
    // skipDuplicates: true,
  });

  // Prizes
  await prisma.prize.createMany({
    data: [
      { name: 'Prize 1', description: 'Prize 1 description', points: 100, stock: 10, isActive: true },
      { name: 'Prize 2', description: 'Prize 2 description', points: 200, stock: 5, isActive: true },
    ],
    // skipDuplicates: true,
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
