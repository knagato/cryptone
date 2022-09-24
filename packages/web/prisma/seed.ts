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
    nickname: "Carol",
  },
  {
    address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    nickname: "Account#18",
  },
];

const images: Prisma.ImageCreateInput[] = [
  {
    imageUrl:
      "https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png",
    prompt: "crows",
    jacketCID: "bafybeigcvm2jw6a2xwpl7g2syrbqrhogwz7ek3ick3a5i52ordk4cbot3a",
  },
  {
    imageUrl:
      "https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png",
    prompt: "electric sheep, neon, synthwave",
    jacketCID: "bafybeig5sggcwlupsugcitdtikxbv5gvoxwhvj5z3qo7jnwz54v7rnqv4y",
  },
  {
    imageUrl:
      "https://replicate.com/api/models/stability-ai/stable-diffusion/files/093a4a46-9149-4f45-aa24-203572b068e5/out-0.png",
    prompt: "sky, cloud",
    jacketCID: "bafybeidaucvr5wjlujtdgaq2n4cygkmmdozfkx33nopxt7p52oki5273im",
  },
  {
    imageUrl:
      "https://replicate.com/api/models/stability-ai/stable-diffusion/files/1f2440c0-ce84-4e4a-94d4-f431ff45138d/out-0.png",
    prompt: "summer beach",
    jacketCID: "bafybeicgszgrshjxyclpqjt6u4h345tqd7qdfmmgcbpklfgrs2r4drr46u",
  },
];

const audioNFTs: Prisma.AudioNFTCreateInput[] = [
  {
    chainId: 80001,
    contractAddress: "0x01",
    tokenId: 1,
    title: "audio1",
    encryptedAudioCID: "",
    encryptedSymmetricKey: "",
    jacketImageCID: "QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi",
    creator: {
      connect: {
        address: "0x01",
      },
    },
    previewAudioCID: "previewaudiocid",
    balanceOfAudioNFT: {
      create: {
        user: {
          connect: {
            address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          },
        },
        balance: 1,
      },
    },
    decryptedAudioUrl:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
  },
];

const uploadAudios: Prisma.UploadAudioCreateInput[] = [
  {
    title: "Audio title",
    description: "Audio description",
    audioUrl:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
    previewUrl:
      "https://nszknao-sandbox.s3.ap-northeast-1.amazonaws.com/cat-life.mp3",
    previewAudioCID: "previewaudiocid",
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

  for (const image of images) {
    await prisma.image.create({
      data: image,
    });
  }

  for (const audioNFT of audioNFTs) {
    await prisma.audioNFT.create({
      data: audioNFT,
    });
  }

  for (const uploadAudio of uploadAudios) {
    await prisma.uploadAudio.create({
      data: uploadAudio,
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
