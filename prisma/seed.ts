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
            title: "Prisma Seed 1",
            body: "jgjhghjg",
          },
          {
            title: "Prisma Seed 2",
            body: "ghdhgdfg",
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@gmail.com" },
    update: {},
    create: {
      email: "bob@gmail.com",
      name: "BOB",
      password: "test123",
      Book: {
        create: [
          {
            title: "Prisma Seed 3",
            body: "jgjhghjg",
          },
          {
            title: "Prisma Seed 4",
            body: "ghdhgdfg",
          },
        ],
      },
    },
  });

  console.log({ alice, bob });
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
