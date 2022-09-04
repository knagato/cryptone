import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
  {
    address: "0x00",
  },
];

async function main() {
  console.log(`Start truncating ...`);

  for (const { table_name } of await prisma.$queryRaw<
    { table_name: string }[]
  >`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table_name}" CASCADE;`);
  }

  console.log(`Truncating finished.`);

  console.log(`Start seeding ...`);

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
