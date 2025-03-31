const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting affiliate seeding...');

  // Retrieve all existing users
  const users = await prisma.user.findMany();

  // For each user, create an affiliate record if one does not already exist
  for (let i = 0; i < users.length; i++) {
    const existingAffiliate = await prisma.affiliate.findFirst({
      where: { userId: users[i].id },
    });
    if (!existingAffiliate) {
      await prisma.affiliate.create({
        data: {
          token: `AFFILIATE_TOKEN_${i + 1}_${Date.now()}`,
          userId: users[i].id,
        },
      });
    }
  }

  console.log(`Affiliate seeding completed for ${users.length} users.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during affiliate seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
