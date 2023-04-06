import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "test@gmail.com" },
    update: {},
    create: {
      email: "test@gmail.com",
      name: "Test",
      password: "test123",
      Book: {
        create: [
          {
            title: "Prisma Seed",
            body: "jgjhghjg",
          },
          {
            title: "Prisma Seed",
            body: "ghdhgdfg",
          },
        ],
      },
    },
  });

  console.log({ alice });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
