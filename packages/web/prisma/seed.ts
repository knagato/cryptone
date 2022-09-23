import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
  {
    address: "0x01",
    nickname: "Alice",
  },
  {
    address: "0x02",
    nickname: "Bob",
  },
  {
    address: "0x03",
    nickname: "Carol"
  },
];

const images: Prisma.ImageCreateInput[] = [
  {
    replicateId: 'rdjp5iduprg7fljmjxtsi4k6xi',
    imageUrl: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png',
    prompt: 'crows',
    jacketCID: 'bafybeigcvm2jw6a2xwpl7g2syrbqrhogwz7ek3ick3a5i52ordk4cbot3a'
  },
  { replicateId: 'z32ygtk7xnemjpulylfglramaa',
    imageUrl: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png',
    prompt: 'electric sheep, neon, synthwave',
    jacketCID: 'aaa'
  }
]

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

  for (const image of images) {
    await prisma.image.create({
      data: image,
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
