// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Replicate, { Model } from 'replicate-js'
import { prisma } from "src/lib/prisma";
import { Image } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { Fields, IncomingForm } from "formidable";
import { Web3Storage, File as Web3File } from 'web3.storage'

const dummyImages = [
  { imageUrl: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png', prompt: 'crows' },
  { imageUrl: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png', prompt: 'electric sheep, neon, synthwave' },
  { imageUrl: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/093a4a46-9149-4f45-aa24-203572b068e5/out-0.png', prompt: 'sky, cloud' },
  { imageUrl: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/1f2440c0-ce84-4e4a-94d4-f431ff45138d/out-0.png', prompt: 'summer beach' }
]

const token = process.env.REPLICATE_TOKEN;
const replicate = token ? new Replicate({ token: process.env.REPLICATE_TOKEN }) : undefined;
let repModel: Model | undefined;

const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY
const web3Storage = WEB3_STORAGE_KEY
  ? new Web3Storage({ token: WEB3_STORAGE_KEY })
  : undefined;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function getImages(creatorAddress: string, limit: number = 100): Promise<Image[]> {
  const images = await prisma.image.findMany( { where: { creatorAddress }, take: limit } )
  return images
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req: req });
  const address = token?.sub ?? null;
  switch (req.method) {
    case 'GET':
        if (!address) {
          return res.status(200).json({images: []});
        }
        const limit = parseInt(req.query.limit as string) || 100
        const images = await getImages(address, limit)
        res.status(200).json({
          images: images
        })
        break
    case 'POST':
      if (!address) {
        return res.status(401).end("401 Unauthorized");
      }
      const form = new IncomingForm({ keepExtensions: true });
      const fields = await new Promise<Fields>((resolve) => {
        form.parse(
          req,
          (err, fields, files) => resolve(fields),
        )  
      })
      // debug
      // curl -X POST -H "Content-Type: application/json" -d '{"prompt":"crows"}' localhost:3000/api/images
      const prompt = fields.prompt as string;
      console.log('prompt', prompt)

      // repModel ||= await replicate?.models.get('replicate/hello-world');
      // const prediction = await repModel?.predict({ text: prompt});
      repModel ||= await replicate?.models.get('stability-ai/stable-diffusion');
      const prediction = await repModel?.predict({prompt: prompt});
      const idx = Math.floor(Math.random() * dummyImages.length);
      const image = prediction && prediction.length > 0 ? {
        imageUrl: prediction[0],
        prompt: prompt
      } : {
        ...dummyImages[idx],
        prompt: prompt
      }

      const imageFileRes = await fetch(image.imageUrl)
      const imageFileBlob = await imageFileRes.blob()

      const imageFile = new Web3File([imageFileBlob], 'jacket', { type: 'image/png' })
      const imageCID = await web3Storage?.put([imageFile])

      const createImage = prisma.image.create({
        data: {
          imageUrl: image.imageUrl,
          prompt: image.prompt,
          jacketCID: imageCID?.toString(),
          creatorAddress: address
        }
      })
      const [savedImage] = await prisma.$transaction([createImage]);
      res.status(200).end(JSON.stringify({
        images: [image]
      }))
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
