const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  const users = [];
  const products = [];

  // Create 20 users
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: `password${i}`,
      },
    });
    users.push(user);
  }

  // Create 20 products
  for (let i = 1; i <= 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)), // Random price between 10 and 110
      },
    });
    products.push(product);
  }

  // Create 20 reviews (one for each product by random users)
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[i];

    await prisma.review.create({
      data: {
        productId: product.id,
        userId: user.id,
        rating: Math.floor(Math.random() * 5) + 1, // 1 to 5
        comment: `Review for product ${product.name} by ${user.name}`,
      },
    });
  }

  console.log('Seeding completed with 20 users, products, and reviews.');
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
